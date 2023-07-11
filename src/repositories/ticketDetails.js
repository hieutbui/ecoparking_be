import { OutputType, print } from '../helpers/print.js';
import Parking from '../models/Parking.js';
const calculateExtendFee = async ( Duration, extendPrice,TotalPrice, extendDuration, parkingId) => {
  try {
    const parking = await Parking.findById(parkingId).populate('unitPrice');
    const { price } = parking.unitPrice;
    
   let extendPrice = 0;
  /*
    if (chosenTime)
    {
      extendPrice = extendTime*price
    } else (!chosenTime && extendTime) {
      extendPrice = (checkoutHour-chosenTime)*price*0.15
    }
   */
  
  
    if (Duration < 1) {
      alert('Hãy mua thêm giờ');
      extendPrice = extendDuration*price;
    } else (!extendDuration && extendTime); {
      TotalPrice = Duration + (extendDuration*price*0.15);
    }
  } catch (error) {
    throw new Error (`Failed to calculate the extend parking fee. Error: ${err.message}`);
  }
}

export default {
  calculateExtendFee,
};
