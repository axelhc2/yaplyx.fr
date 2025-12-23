// cve-nextjs.js

const res = await fetch(
    "https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=next.js"
  );
  
  const data = await res.json();
  
  console.log("🔐 CVE Next.js trouvées :\n");
  
  data.vulnerabilities.forEach(v => {
    const cve = v.cve.id;
    const desc = v.cve.descriptions.find(d => d.lang === "en")?.value;
    const severity =
      v.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity ?? "N/A";
  
    console.log("━━━━━━━━━━━━━━━━━━━━");
    console.log("CVE :", cve);
    console.log("Sévérité :", severity);
    console.log("Description :", desc);
  });
  