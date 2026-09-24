/**
 * KarbonFiyat CBAM XML Beyanname Üretim Motoru
 * (Avrupa Komisyonu CBAM Transitional Registry XML Şeması ile Uyumlu)
 */

export interface CbamXmlPayload {
  declarantId: string;
  declarantName: string;
  countryOfOrigin: string; // "TR"
  destinationCountry: string; // "DE", "IT", "FR" vb.
  gtipCode: string; // örn: "7208 39 00"
  goodsDescription: string;
  netMassTons: number;
  directSpecificEmissions: number; // tCO2e/ton
  indirectSpecificEmissions: number; // tCO2e/ton
  totalEmbeddedEmissions: number; // tCO2e
  carbonPricePaidInOriginEur: number; // Menşe ülkede ödenen karbon fiyatı mahsubu (€/ton)
  reportingPeriodQuarter: string; // "Q1-2026", "Q2-2026"
  calculationDate: string; // ISO format
}

function escapeXml(unsafe: string): string {
  return String(unsafe || "").replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

export function generateCbamXml(payload: CbamXmlPayload): string {
  const totalEmissions = Number((payload.totalEmbeddedEmissions || ((payload.directSpecificEmissions + payload.indirectSpecificEmissions) * payload.netMassTons)).toFixed(3));
  const effectiveOffset = Number((payload.carbonPricePaidInOriginEur * payload.netMassTons).toFixed(2));

  return `<?xml version="1.0" encoding="UTF-8"?>
<CBAMQuarterlyReport xmlns="urn:eu:ec:cbam:v1:report" 
                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                    reportId="CBAM-TR-${Date.now()}"
                    reportingPeriod="${escapeXml(payload.reportingPeriodQuarter)}"
                    submissionDate="${escapeXml(payload.calculationDate)}">
  <Header>
    <PlatformGenerator>KarbonFiyat Compliance Engine (karbonfiyat.com)</PlatformGenerator>
    <StandardVersion>Regulation (EU) 2023/956</StandardVersion>
    <VerificationStatus>Self-Declared / Preliminary Audit</VerificationStatus>
  </Header>

  <DeclarantInformation>
    <DeclarantID>${escapeXml(payload.declarantId)}</DeclarantID>
    <CompanyName>${escapeXml(payload.declarantName)}</CompanyName>
    <CountryOfOrigin>${escapeXml(payload.countryOfOrigin || "TR")}</CountryOfOrigin>
    <DestinationCountry>${escapeXml(payload.destinationCountry)}</DestinationCountry>
  </DeclarantInformation>

  <ImportedGoodsInformation>
    <CNCode>${escapeXml(payload.gtipCode.replace(/\s+/g, ""))}</CNCode>
    <CommercialDescription>${escapeXml(payload.goodsDescription)}</CommercialDescription>
    <NetMassQuantity unit="MetricTons">${payload.netMassTons.toFixed(2)}</NetMassQuantity>
  </ImportedGoodsInformation>

  <EmissionsDetermination>
    <DirectSpecificEmissions unit="tCO2e/t">${payload.directSpecificEmissions.toFixed(4)}</DirectSpecificEmissions>
    <IndirectSpecificEmissions unit="tCO2e/t">${payload.indirectSpecificEmissions.toFixed(4)}</IndirectSpecificEmissions>
    <TotalSpecificEmissions unit="tCO2e/t">${(payload.directSpecificEmissions + payload.indirectSpecificEmissions).toFixed(4)}</TotalSpecificEmissions>
    <TotalEmbeddedEmissions unit="tCO2e">${totalEmissions.toFixed(3)}</TotalEmbeddedEmissions>
  </EmissionsDetermination>

  <CarbonPricePaidInCountryOfOrigin>
    <ApplicableRegulation>Article 9 - Offset of Carbon Price Effectively Paid</ApplicableRegulation>
    <UnitRatePaidEurPerTon>${payload.carbonPricePaidInOriginEur.toFixed(2)}</UnitRatePaidEurPerTon>
    <TotalOffsetClaimedEur>${effectiveOffset.toFixed(2)}</TotalOffsetClaimedEur>
  </CarbonPricePaidInCountryOfOrigin>
</CBAMQuarterlyReport>`;
}
