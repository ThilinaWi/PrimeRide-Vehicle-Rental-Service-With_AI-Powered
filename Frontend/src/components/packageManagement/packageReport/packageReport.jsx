import React, { useState, useEffect, useRef } from 'react';
import { packageService } from '../../../services/packageService';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

const PackageReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await packageService.getPackageReport();
        console.log('Fetched report data:', data);
        setReportData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error fetching report data');
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const formatFeatures = (features, customFeatures = []) => {
    const standardFeatures = features && typeof features === 'object'
      ? Object.keys(features).filter(key => features[key] === true || features[key] === 'true')
      : [];
    const arrayFeatures = Array.isArray(features) ? features.filter(Boolean) : [];
    const custom = Array.isArray(customFeatures) ? customFeatures.filter(Boolean) : [];
    const allFeatures = [...new Set([...standardFeatures, ...arrayFeatures, ...custom])];
    return allFeatures.length > 0 ? allFeatures.join(', ') : 'N/A';
  };

  const downloadPDF = () => {
    try {
      if (!reportRef.current) {
        throw new Error('Report content not found for PDF generation');
      }
      console.log('Starting PDF generation, ref content:', reportRef.current);
      html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: true,
        ignoreElements: (el) => el.tagName === 'CANVAS',
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight);
        pdf.save('Rental_Packages_Report.pdf');
        console.log('PDF saved successfully');
      }).catch((error) => {
        console.error('PDF generation error:', error);
        setError(`Failed to generate PDF: ${error.message}`);
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError(`Failed to generate PDF: ${error.message}`);
    }
  };

  const handleButtonClick = () => {
    console.log('Button clicked');
    downloadPDF();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
        <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '3rem', width: '3rem', borderTop: '2px solid #3b82f6', borderBottom: '2px solid #3b82f6' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '1rem', borderRadius: '0.375rem', textAlign: 'center' }}>
        {error} <br /> Please ensure the report content is loaded and try again.
      </div>
    );
  }

  return (
    <div style={{ margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937' }}>
          Rental Packages Report
        </h2>
        <button
          onClick={handleButtonClick}
          style={{ backgroundColor: '#4f46e5', color: 'white', fontWeight: '500', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', transition: 'background-color 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer' }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
          disabled={!reportData}
        >
          Download PDF Report
        </button>
      </div>

      <div ref={reportRef} style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: '#1a202c' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#2d3748', borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem' }}>
          Rental Packages Report
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1.5rem' }}>
          Generated on: {new Date(reportData.summary.dateGenerated).toLocaleDateString()}
        </p>

        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4a5568', marginBottom: '1rem' }}>Executive Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.375rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4c51bf' }}>Total Packages</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>{reportData.summary.totalPackages}</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.375rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4c51bf' }}>Package Types</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>{reportData.summary.packageTypes}</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.375rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4c51bf' }}>Average Price/Day</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>${reportData.summary.avgPrice}</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4a5568', marginBottom: '1rem' }}>Package Type Distribution</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '100%', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}>
              <thead style={{ backgroundColor: '#e2e8f0' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Package Type</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {reportData.packageTypeDistribution.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}>
                    <td style={{ padding: '0.75rem 1rem', color: '#4a5568' }}>{item.type}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#4a5568' }}>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4a5568', marginBottom: '1rem' }}>Price Range Analysis</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '100%', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}>
              <thead style={{ backgroundColor: '#e2e8f0' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Price Range ($/day)</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(reportData.priceDistribution).map(([range, count], index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}>
                    <td style={{ padding: '0.75rem 1rem', color: '#4a5568' }}>{range}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#4a5568' }}>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4a5568', marginBottom: '1rem' }}>Popular Features</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '100%', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}>
              <thead style={{ backgroundColor: '#e2e8f0' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Feature</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {reportData.popularFeatures.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}>
                    <td style={{ padding: '0.75rem 1rem', color: '#4a5568' }}>
                      {typeof item === 'object' && item.feature ? item.feature.replace(/_/g, ' ') : item}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#4a5568' }}>
                      {typeof item === 'object' && item.count !== undefined ? item.count : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4a5568', marginBottom: '1rem' }}>Detailed Package List</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '100%', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}>
              <thead style={{ backgroundColor: '#e2e8f0' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>ID</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Duration</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Price ($/day)</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Seats</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Luggage</th>
                </tr>
              </thead>
              <tbody>
                {reportData.packages.map((pkg, index) => (
                  <React.Fragment key={index}>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}>
                      <td style={{ padding: '0.75rem 1rem', color: '#4a5568' }}>{pkg.package_id}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#4a5568' }}>{pkg.package_name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#4a5568' }}>{pkg.package_type}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#4a5568' }}>{pkg.duration}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#4a5568' }}>${pkg.price_per_day}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#4a5568' }}>{pkg.seating_capacity}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#4a5568' }}>{pkg.luggage_capacity}</td>
                    </tr>
                    <tr>
                      <td colSpan="7" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#4a5568', backgroundColor: '#edf2f7' }}>
                        <strong style={{ color: '#2d3748' }}>Additional Features:</strong> {formatFeatures(pkg.additional_features, pkg.custom_additional_features)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="7" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#4a5568', backgroundColor: '#edf2f7' }}>
                        <strong style={{ color: '#2d3748' }}>Safety Features:</strong> {formatFeatures(pkg.safety_security_features, pkg.custom_safety_security_features)}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PackageReport;