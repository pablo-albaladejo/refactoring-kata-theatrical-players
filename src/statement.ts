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

type Statement = {
  customer: string;
  performances: PerformanceDetails[];
  totalAmountInUSD: string;
  totalCredits: number;
};

type PerformanceDetails = {
  name: string;
  audience: number;
  amountInUSD: string;
};

function createStatement(summary: PerformanceSummary, plays: Record<string, Play>): Statement {
  return {
    customer: summary.customer,
    performances: summary.performances.map(performance => {
      return createStatementDetails(plays, performance);
    }),
    totalAmountInUSD: formatAmountUSD(calculateTotalAmount(summary, plays)),
    totalCredits: calculateTotalCredits(summary, plays),
  };
}

function createStatementDetails(plays: Record<string, Play>, performance: Performance): PerformanceDetails {
  const play = plays[performance.playID];
  const amount = calculateAmountForPerformance(play, performance);
  return {
    name: play.name,
    audience: performance.audience,
    amountInUSD: formatAmountUSD(amount),
  };
}

export function statement(summary: PerformanceSummary, plays: Record<string, Play>) {
  const statement = createStatement(summary, plays);
  return renderAsPlainText(statement);
}

function renderAsPlainText(statement: Statement) {
  let result = `Statement for ${statement.customer}\n`;
  for (let performanceDetail of statement.performances) {
    result += ` ${performanceDetail.name}: ${performanceDetail.amountInUSD} (${performanceDetail.audience} seats)\n`;
  }

  result += `Amount owed is ${statement.totalAmountInUSD}\n`;
  result += `You earned ${statement.totalCredits} credits\n`;
  return result;
}

function calculateTotalAmount(summary: PerformanceSummary, plays: Record<string, Play>) {
  return summary.performances.reduce((accumulatedAmount, performance) => {
    const play = plays[performance.playID];
    return accumulatedAmount + calculateAmountForPerformance(play, performance);
  }, 0);
}

function calculateTotalCredits(summary: PerformanceSummary, plays: Record<string, Play>) {
  return summary.performances.reduce((accumultedCredits, performance) => {
    const play = plays[performance.playID];
    return accumultedCredits + calculateVolumeCredits(play, performance);
  }, 0);
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

