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
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let performance of summary.performances) {
    const play = plays[performance.playID];
    let thisAmount = calculateAmountForPerformance(play, performance);
    // add volume credits
    volumeCredits += calculateVolumeCredits(performance, play);
    // print line for this order
    result += ` ${play.name}: ${format(thisAmount / 100)} (${
      performance.audience
    } seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

function calculateVolumeCredits(performance: Performance, play: Play) {
  let credits = 0;
  const baseCredits = Math.max(performance.audience - 30, 0);
  credits += baseCredits;
  const comedyAttendeeCredits = Math.floor(performance.audience / 5);
  if ("comedy" === play.type) credits += comedyAttendeeCredits;
  return credits;
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

