export function formatRelationshipTime(duration: { years: number; months: number; days: number }): string {
  const { years, months, days } = duration;
  
  const parts = [];
  
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
  }
  
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
  }
  
  if (days > 0 || parts.length === 0) {
    parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);
  }
  
  if (parts.length === 1) {
    return parts[0];
  } else if (parts.length === 2) {
    return parts.join(' e ');
  } else {
    return `${parts.slice(0, -1).join(', ')} e ${parts[parts.length - 1]}`;
  }
}