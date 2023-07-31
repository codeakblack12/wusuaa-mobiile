import 'intl';
import "intl/locale-data/jsonp/en-US";

export const Initials = (name) => {
    var names = name?.split(" ");
    for(var i = 0; i < names?.length; i++){
      if(names[i] == "" || names[i] == " "){
        names.splice(i, 1)
      }
    }
    if(names?.length > 1){
      return names[0][0]?.toUpperCase() + names[1][0]?.toUpperCase()
    }
    else if(names?.length === 1){
      return names[0][0]?.toUpperCase()
    }else{
      return ""
    }

}

export const modalImages = (images) => {
  const result: any = []
  for(var i = 0; i < images?.length; i++){
      const image: any = {uri: images[i]}
      result.push(image)
  }
  return result
}

export const firstLetterUppercase = (value: string) => {
  if(value && value.length > 1){
    return `${value[0].toUpperCase()}${value.slice(1)}`
  }

  return ""

}

function truncateToDecimals(num, dec = 2) {
  const calcDec = Math.pow(10, dec);
  return Math.trunc(num * calcDec) / calcDec;
}

export function formatMoney(_amount: string, currency: string) {
  const amount = truncateToDecimals(parseFloat(_amount));

  if (currency === 'NGN') {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)?.replace(".00", "");
  }

  if (currency === 'GHS') {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)?.replace(".00", "");
  }

  return amount

}