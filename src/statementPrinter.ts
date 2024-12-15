import {PerformanceSummary, Play} from "./performanceCalculator";
import {createStatement, Statement} from "./statement";

export function statementPrinter(summary: PerformanceSummary, plays: Record<string, Play>) {
  const statement = createStatement(summary, plays);
  return printStatementAsPlainText(statement);
}

function printStatementAsPlainText(statement:Statement) {
  let result = `Statement for ${statement.customer}\n`;
  for (let performance of statement.performances) {
    result += ` ${performance.playName}: ${performance.amountInUSD} (${performance.audience} seats)\n`;
  }
  result += `Amount owed is ${statement.totalAmountInUSD}\n`;
  result += `You earned ${statement.totalCredits} credits\n`;
  return result;
}

function printStatementAsHtml(statement:Statement) {
  let result = `<h1>Statement for ${statement.customer}</h1>`;
  result += `<ul>`
  for (let performance of statement.performances) {
    result += `<li> ${performance.playName}: ${performance.amountInUSD} (${performance.audience} seats)</li>`;
  }
  result += `</ul>`
  result += `<p>Amount owed is ${statement.totalAmountInUSD}</p>`;
  result += `<p>You earned ${statement.totalCredits} credits</p>`;
  return result;
}

