
/**
 * Retorna o nome da bodas de acordo com o tempo de relacionamento
 */
export function getWeddingAnniversaryName(years: number): string {
  const anniversaries: Record<number, string> = {
    0: "Namoro",
    1: "Bodas de Papel",
    2: "Bodas de Algodão",
    3: "Bodas de Couro ou Trigo",
    4: "Bodas de Flores ou Frutas",
    5: "Bodas de Madeira",
    6: "Bodas de Açúcar ou Perfume",
    7: "Bodas de Latão ou Lã",
    8: "Bodas de Barro ou Papoula",
    9: "Bodas de Cerâmica",
    10: "Bodas de Estanho ou Zinco",
    11: "Bodas de Aço",
    12: "Bodas de Seda ou Ônix",
    13: "Bodas de Linho ou Renda",
    14: "Bodas de Marfim",
    15: "Bodas de Cristal",
    20: "Bodas de Porcelana",
    25: "Bodas de Prata",
    30: "Bodas de Pérola",
    35: "Bodas de Coral",
    40: "Bodas de Rubi",
    45: "Bodas de Safira",
    50: "Bodas de Ouro",
    55: "Bodas de Esmeralda",
    60: "Bodas de Diamante",
    65: "Bodas de Platina",
    70: "Bodas de Vinho",
    75: "Bodas de Brilhante",
    80: "Bodas de Carvalho",
    85: "Bodas de Girassol",
    90: "Bodas de Álamo",
    95: "Bodas de Nogueira",
    100: "Bodas de Jequitibá"
  };

  return anniversaries[years] || "Namoro";
}
