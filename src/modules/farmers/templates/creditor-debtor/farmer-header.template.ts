/* eslint-disable prettier/prettier */
import { FarmerInterface } from "src/shared/interfaces/farmer.interface";
import { getTotalForField } from "victor-dev-toolbox";

// function calculateTotalsFromCreditors(items: CreditorInterface[] | DebtorInterface[]) {
//   const totalAmount = getTotalForField(items, 'totalAmount');
//   const amountPaid = getTotalForField(items, 'amountPaid');
//   const balance = totalAmount - amountPaid;

//   return { totalAmount, balance, amountPaid }
// }

export function farmerHeaderTemplate(items: FarmerInterface[]): string {
  // const { totalAmount, balance, amountPaid } = calculateTotalsFromCreditors(items);
  const balance = getTotalForField(items, 'balance');

  return `
 
   <div>
    
    <div style="border: 1px solid #ccc; padding: 15px; border-radius: 8px; background-color: #f9f9f9;">

      <p style="margin: 5px 0; font-size: 16px;">
        <span style="color: #2f4fd0;">Outstanding Balance:</span> 
        <span style="color: ${balance >= 0 ? '#0b930b' : '#ff0000'};">
          ${'KES ' + balance.toFixed(2)}
        </span>
      </p>
     
    </div>
   </div>

  `;
}


// <p style="margin: 5px 0; font-size: 16px;">
// <span style="color: #2f4fd0;">Total Amount:</span>
// <span style="color: #ff0000;">${'KES ' + totalAmount.toFixed(2)}</span>
// </p>
// <p style="margin: 5px 0; font-size: 16px;">
// <span style="color: #2f4fd0;">Amount Paid:</span>
// <span style="color: #0b930b;">${'KES ' + amountPaid.toFixed(2)}</span>
// </p>