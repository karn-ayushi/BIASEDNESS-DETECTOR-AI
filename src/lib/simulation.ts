import { Candidate, FairnessAnalysis, AttributeMetrics, Gender, Region, AgeGroup, Education } from '../types';

export const generateSampleData = (count: number = 40): Candidate[] => {
  const maleNames = ['Arjun', 'Rajesh', 'Amit', 'James', 'Robert', 'John', 'Michael', 'David', 'William', 'Ishaan', 'Vihaan', 'Aarav'];
  const femaleNames = ['Priya', 'Ananya', 'Sita', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Diya', 'Advika', 'Kavya'];
  const regions: Region[] = ['Urban', 'Rural', 'Suburban'];
  const ages: AgeGroup[] = ['18-25', '26-40', '41-60'];
  const educations: Education[] = ['UG', 'PG'];

  const candidates: Candidate[] = [];

  for (let i = 0; i < count; i++) {
    const isMale = Math.random() > 0.45;
    const name = isMale 
      ? maleNames[Math.floor(Math.random() * maleNames.length)]
      : femaleNames[Math.floor(Math.random() * femaleNames.length)];
    
    // Bias generation:
    // Gender: High skills for everyone
    // Region: Rural candidates might have slightly lower "access" scores but high potential
    // Age: Older candidates have more experience
    candidates.push({
      id: Math.random().toString(36).substr(2, 9),
      name,
      gender: isMale ? 'Male' : 'Female',
      region: regions[Math.floor(Math.random() * regions.length)],
      ageGroup: ages[Math.floor(Math.random() * ages.length)],
      education: educations[Math.floor(Math.random() * educations.length)],
      skills: Math.floor(Math.random() * 40) + 60,
      experience: Math.floor(Math.random() * 20),
    });
  }

  return candidates;
};

export const runSimulation = (
  candidates: Candidate[], 
  isMitigationEnabled: boolean
): { results: Candidate[]; analysis: FairnessAnalysis } => {
  
  const results = candidates.map(c => {
    // SCORING LOGIC
    // Core attributes: Skills (60%) and Experience (40%)
    let score = (c.skills * 0.6) + (c.experience * 4);
    
    // BIASED SCORING (Only active if mitigation is disabled)
    // This represents historical bias embedded in model weights
    if (!isMitigationEnabled) {
      if (c.gender === 'Female') score -= 12; // Gender bias
      if (c.region === 'Rural') score -= 10;   // Geographic bias
      if (c.ageGroup === '41-60') score -= 5;  // Age bias (proxy for "lack of modern skill" bias)
    } else {
      // MITIGATION:
      // In fair mode, we rely strictly on merit (skills/exp) 
      // and potentially boost under-represented groups in the uncertainty band (Reject Option Classification)
      // Actually, just ignoring sensitive variables is a strong start.
    }

    return { ...c, score };
  });

  // Select top 15 candidates
  const sorted = [...results].sort((a, b) => (b.score || 0) - (a.score || 0));
  const threshold = sorted[14]?.score || 0;

  const finalResults = results.map(c => ({
    ...c,
    selected: (c.score || 0) >= threshold && (c.score || 0) > 0
  }));

  const analysis = calculateMultiAttributeMetrics(finalResults);

  return { results: finalResults, analysis };
};

export const calculateMultiAttributeMetrics = (candidates: Candidate[]): FairnessAnalysis => {
  const selected = candidates.filter(c => c.selected);
  
  const analysis: FairnessAnalysis = {
    overall: {
      total: candidates.length,
      selected: selected.length,
      selectionRate: candidates.length > 0 ? selected.length / candidates.length : 0,
      fairnessScore: 0
    },
    attributes: {},
    anyBiasDetected: false
  };

  const attributesToAudit: (keyof Candidate)[] = ['gender', 'region', 'ageGroup', 'education'];
  let totalImpactRatio = 0;
  let attributeCount = 0;

  attributesToAudit.forEach(attr => {
    const groupsMap = new Map<string, { count: number; selected: number }>();
    
    candidates.forEach(c => {
      const val = String(c[attr]);
      const current = groupsMap.get(val) || { count: 0, selected: 0 };
      current.count++;
      if (c.selected) current.selected++;
      groupsMap.set(val, current);
    });

    const groupsData = Array.from(groupsMap.entries()).map(([name, stats]) => ({
      name,
      count: stats.count,
      selectedCount: stats.selected,
      selectionRate: stats.count > 0 ? stats.selected / stats.count : 0
    }));

    // Calculate Impact Ratio (Adverse Impact)
    const rates = groupsData.map(g => g.selectionRate);
    const maxRate = Math.max(...rates);
    const minRate = Math.min(...rates);
    
    const impactRatio = maxRate > 0 ? minRate / maxRate : 1;
    const biasDetected = impactRatio < 0.8 && maxRate > 0;
    
    if (biasDetected) analysis.anyBiasDetected = true;
    
    totalImpactRatio += impactRatio;
    attributeCount++;

    // Disadvantaged is the one with min rate
    const disadvantaged = groupsData.length > 0 
      ? groupsData.reduce((prev, curr) => prev.selectionRate < curr.selectionRate ? prev : curr)
      : { name: 'N/A' };

    analysis.attributes[attr] = {
      attributeName: attr,
      groups: groupsData,
      impactRatio,
      biasDetected,
      disadvantagedGroup: disadvantaged.name
    };
  });

  analysis.overall.fairnessScore = Math.round((totalImpactRatio / attributeCount) * 100);

  return analysis;
};
