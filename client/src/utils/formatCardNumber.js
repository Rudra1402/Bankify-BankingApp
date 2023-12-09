export const formattedNumber = (cardNo) => {
    let formattedNumber = cardNo.replace(/(\d{4})/g, '$1 ').trim();
    let temp = formattedNumber;
    temp = temp.split(" ")
    let str = [];
    for (let i = 0; i < temp.length; i++) {
        if (i != temp.length - 1)
            str.push("****")
    }
    str.push(temp[temp.length - 1])
    return str.join(" ");
}