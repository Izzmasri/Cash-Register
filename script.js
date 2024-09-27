const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const change = document.getElementById("change-due");
const pennies = document.getElementById("pennies");
const nickels = document.getElementById("nickels");
const dimes = document.getElementById("dimes");
const quarters = document.getElementById("quarters");
const dollar = document.getElementById("dollar");
const fiveDollars = document.getElementById("fiveDollars");
const tenDollars = document.getElementById("tenDollars");
const twentyDollars = document.getElementById("twentyDollars");
const oneHundred = document.getElementById("oneHundred");


let price = 19.5;
let cid = [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.1],
    ['QUARTER', 4.25],
    ['ONE', 90],
    ['FIVE', 55],
    ['TEN', 20],
    ['TWENTY', 60],
    ['ONE HUNDRED', 100]
];

let currencyUnit = [
    ['PENNY', 0.01],
    ['NICKEL', 0.05],
    ['DIME', 0.1],
    ['QUARTER', 0.25],
    ['ONE', 1],
    ['FIVE', 5],
    ['TEN', 10],
    ['TWENTY', 20],
    ['ONE HUNDRED', 100]
];




const getChange = (changeDue,cid) =>{
    let totalCid = parseFloat(cid.reduce((sum,[_,amount])=>sum + amount,0).toFixed(2));

    if(totalCid < changeDue){
        return { status: "INSUFFICIENT_FUNDS", change: []};
    }

    if(changeDue === totalCid){
        return{ status: "CLOSED", change: cid};
    }


    let changeArr = [];
    let remainingChange = changeDue;
    for(let i = currencyUnit.length - 1 ;i >= 0;i--){
        let unit = currencyUnit[i][0];
        let unitValue = currencyUnit[i][1];
        let unitInDrawer = cid[i][1];

        if(unitValue <= remainingChange && unitInDrawer > 0){
            let amountFromUnit = 0;
            while(remainingChange >= unitValue && unitInDrawer > 0){
                remainingChange = parseFloat((remainingChange - unitValue).toFixed(2));
                unitInDrawer -= unitValue;
                amountFromUnit += unitValue;
                cid[i][1] = unitInDrawer;
            }
            if(amountFromUnit > 0){
                changeArr.push([unit,amountFromUnit])
            }
        }
    }

    if(remainingChange > 0){
        return{ status: "INSUFFICIENT_FUNDS", change: []};
    }


    return{ status: "OPEN", change: changeArr};

}

const formatChange = changeArr =>{
    return changeArr.filter(([unit,amount]) => amount > 0)
        .map(([unit,amount])=> `${unit}: $${amount.toFixed(2)}`)
        .join(" ");
}

const updateCashInDrawer = () => {
    pennies.innerHTML = `$${cid[0][1].toFixed(2)}`;
    nickels.innerHTML = `$${cid[1][1].toFixed(2)}`;
    dimes.innerHTML = `$${cid[2][1].toFixed(2)}`;
    quarters.innerHTML = `$${cid[3][1].toFixed(2)}`;
    dollar.innerHTML = `$${cid[4][1].toFixed(2)}`;
    fiveDollars.innerHTML = `$${cid[5][1].toFixed(2)}`;
    tenDollars.innerHTML = `$${cid[6][1].toFixed(2)}`;
    twentyDollars.innerHTML = `$${cid[7][1].toFixed(2)}`;
    oneHundred.innerHTML = `$${cid[8][1].toFixed(2)}`;
};

purchaseBtn.addEventListener("click",()=>{
    const cashValue = parseFloat(cashInput.value);
    const changeDue = parseFloat((cashValue - price).toFixed(2));;

    if(cashValue < price){
        alert("Customer does not have enough money to purchase the item");
        return;
    }else if(cashValue === price){
        change.innerHTML ="No change due - customer paid with exact cash";
        return;
    }

    const changeResult = getChange(changeDue,cid);
    if (changeResult.status === "INSUFFICIENT_FUNDS") {
        change.innerHTML = `Status: ${changeResult.status}`;
    } else if (changeResult.status === "CLOSED") {
        change.innerHTML = `Status: ${changeResult.status} ${formatChange(changeResult.change)}`;
    } else {
        change.innerHTML = `Status: OPEN ${formatChange(changeResult.change)}`;
    }
    updateCashInDrawer();
});