type Play = {
  name: string;
  type: string;
};

type Performance = {
  playID: string;
  audience: number;
};

type PerformanceSummary = {
  customer: string;
  performances: Performance[];
};

export function statement(summary: PerformanceSummary, plays: Record<string, Play>) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${summary.customer}\n`;

  for (let performance of summary.performances) {
    const play = plays[performance.playID];
    let thisAmount = calculateAmountForPerformance(play, performance);
    volumeCredits += calculateVolumeCredits(play, performance);
    result += ` ${play.name}: ${formatAmountUSD(thisAmount)} (${performance.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${formatAmountUSD(totalAmount)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

function formatAmountUSD(totalAmount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(totalAmount / 100);
}

function calculateVolumeCredits(play: Play, performance: Performance) {
  const baseCredits = Math.max(performance.audience - 30, 0);
  const comedyAttendeeCredits = Math.floor(performance.audience / 5);
  return "comedy" === play.type ? baseCredits + comedyAttendeeCredits : baseCredits;
}

function calculateAmountForPerformance(play: Play, performance: Performance) {
  let totalAmount = 0;
  switch (play.type) {
    case "tragedy":
      totalAmount = 40000;
      if (performance.audience > 30) {
        totalAmount += 1000 * (performance.audience - 30);
      }
      break;
    case "comedy":
      totalAmount = 30000;
      if (performance.audience > 20) {
        totalAmount += 10000 + 500 * (performance.audience - 20);
      }
      totalAmount += 300 * performance.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return totalAmount;
}

