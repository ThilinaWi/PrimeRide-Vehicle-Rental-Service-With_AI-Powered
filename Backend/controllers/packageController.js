const Package = require("../models/packageModel");
const multer = require("multer");
const path = require("path");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb("Error: Images only (jpeg, jpg, png)");
  },
}).single("image_upload");

const createPackage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const {
        package_id,
        package_name,
        package_type,
        duration,
        price_per_day,
        description,
        vehicle_model,
        vehicle_number,
        seating_capacity,
        luggage_capacity,
        additional_features,
        safety_security_features
      } = req.body;

      const existingPackage = await Package.findOne({ package_id });
      if (existingPackage) {
        return res.status(400).json({ message: "Package ID already exists" });
      }

      let parsedAdditionalFeatures = {};
      let parsedSafetyFeatures = {};

      try {
        parsedAdditionalFeatures = typeof additional_features === 'string' 
          ? JSON.parse(additional_features)
          : additional_features || {};
      } catch (e) {
        console.error("Error parsing additional_features:", e);
        return res.status(400).json({ message: "Invalid additional_features format" });
      }

      try {
        parsedSafetyFeatures = typeof safety_security_features === 'string'
          ? JSON.parse(safety_security_features)
          : safety_security_features || {};
      } catch (e) {
        console.error("Error parsing safety_security_features:", e);
        return res.status(400).json({ message: "Invalid safety_security_features format" });
      }

      const packageData = {
        package_id,
        package_name,
        package_type,
        duration: Array.isArray(duration) ? duration : [duration],
        price_per_day,
        description,
        vehicle_model,
        vehicle_number,
        seating_capacity,
        luggage_capacity,
        additional_features: parsedAdditionalFeatures,
        safety_security_features: parsedSafetyFeatures,
        image_upload: req.file ? `/uploads/${req.file.filename}` : ""
      };

      const newPackage = new Package(packageData);
      await newPackage.save();

      return res.status(201).json({
        message: "Package created successfully",
        package: newPackage
      });

    } catch (error) {
      console.error("Error in createPackage:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  });
};

const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPackageById = async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id);
    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json(packageData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatePackage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      console.log("Received update for package ID:", req.params.id);
      console.log("Request body:", req.body);
      console.log("Uploaded file:", req.file);

      const updateData = { ...req.body };
      
      if (typeof updateData.additional_features === 'string') {
        updateData.additional_features = JSON.parse(updateData.additional_features);
      }
      if (typeof updateData.safety_security_features === 'string') {
        updateData.safety_security_features = JSON.parse(updateData.safety_security_features);
      }

      if (req.file) {
        updateData.image_upload = req.file.path;
      }

      const packageData = await Package.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!packageData) {
        return res.status(404).json({ message: "Package not found" });
      }

      console.log("Update successful:", packageData);
      res.status(200).json({ 
        message: "Package updated successfully",
        package: packageData 
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ 
        message: "Server error",
        error: error.message 
      });
    }
  });
};

const deletePackage = async (req, res) => {
  try {
    const packageData = await Package.findByIdAndDelete(req.params.id);
    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const generatePackageReport = async (req, res) => {
  try {
    const packages = await Package.find().lean(); // Use .lean() to get plain JS objects

    // Calculate summary statistics
    const totalPackages = packages.length;
    const packageTypes = [...new Set(packages.map(pkg => pkg.package_type))];
    const avgPrice = (packages.reduce((sum, pkg) => sum + pkg.price_per_day, 0) / (totalPackages || 1)).toFixed(2);

    // Price range distribution
    const priceRanges = ['0-50', '51-100', '101-150', '151-200', '200+'];
    const priceDistribution = {
      '0-50': packages.filter(pkg => pkg.price_per_day <= 50).length,
      '51-100': packages.filter(pkg => pkg.price_per_day > 50 && pkg.price_per_day <= 100).length,
      '101-150': packages.filter(pkg => pkg.price_per_day > 100 && pkg.price_per_day <= 150).length,
      '151-200': packages.filter(pkg => pkg.price_per_day > 150 && pkg.price_per_day <= 200).length,
      '200+': packages.filter(pkg => pkg.price_per_day > 200).length,
    };

    // Popular features analysis
    const featureCounts = {};
    packages.forEach(pkg => {
      const features = pkg.additional_features || {};
      const safetyFeatures = pkg.safety_security_features || {};

      // Process standard features
      Object.entries(features).forEach(([feature, enabled]) => {
        if (enabled === true || enabled === 'true') {
          featureCounts[feature] = (featureCounts[feature] || 0) + 1;
        }
      });

      Object.entries(safetyFeatures).forEach(([feature, enabled]) => {
        if (enabled === true || enabled === 'true') {
          featureCounts[feature] = (featureCounts[feature] || 0) + 1;
        }
      });

      // Process custom features
      const customFeatures = Array.isArray(pkg.custom_additional_features)
        ? pkg.custom_additional_features.filter(Boolean)
        : [];
      const customSafetyFeatures = Array.isArray(pkg.custom_safety_security_features)
        ? pkg.custom_safety_security_features.filter(Boolean)
        : [];

      [...customFeatures, ...customSafetyFeatures].forEach(feature => {
        if (feature) {
          featureCounts[feature] = (featureCounts[feature] || 0) + 1;
        }
      });
    });

    const popularFeatures = Object.entries(featureCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([feature, count]) => ({ feature, count }));

    // Package type distribution
    const packageTypeDistribution = packageTypes.map(type => ({
      type,
      count: packages.filter(pkg => pkg.package_type === type).length,
    }));

    const reportData = {
      summary: {
        totalPackages,
        packageTypes: packageTypes.length,
        avgPrice,
        dateGenerated: new Date().toISOString(),
      },
      priceDistribution,
      popularFeatures,
      packageTypeDistribution,
      packages: packages.map(pkg => {
        // Convert feature arrays back to objects for PackageReport.jsx
        const additionalFeaturesObj = {};
        const safetyFeaturesObj = {};

        const additionalFeatureKeys = Object.keys(pkg.additional_features || {}).filter(
          key => pkg.additional_features[key] === true || pkg.additional_features[key] === 'true'
        );
        additionalFeatureKeys.forEach(key => {
          additionalFeaturesObj[key] = true;
        });

        const safetyFeatureKeys = Object.keys(pkg.safety_security_features || {}).filter(
          key => pkg.safety_security_features[key] === true || pkg.safety_security_features[key] === 'true'
        );
        safetyFeatureKeys.forEach(key => {
          safetyFeaturesObj[key] = true;
        });

        return {
          package_id: pkg.package_id,
          package_name: pkg.package_name,
          package_type: pkg.package_type,
          duration: Array.isArray(pkg.duration) ? pkg.duration[0] : pkg.duration,
          price_per_day: pkg.price_per_day,
          seating_capacity: pkg.seating_capacity,
          luggage_capacity: pkg.luggage_capacity,
          additional_features: additionalFeaturesObj,
          safety_security_features: safetyFeaturesObj,
          custom_additional_features: pkg.custom_additional_features || [],
          custom_safety_security_features: pkg.custom_safety_security_features || [],
        };
      }),
    };

    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  generatePackageReport,
};