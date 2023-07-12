import { OutputType, print } from '../helpers/print.js';
import Parking from '../models/Parking.js';

// author: dunglda
// calculate ticket: My flow: customer clicked button booking -> booking showed Interface -> Price will be calculated by expected time 
// Example: customer choose checkin and checkoutdated, customer pay the fee 
const calculateFee = async (checkinHour, checkoutHour, parkingId) => {
    try {
      const parking = await Parking.findById(parkingId).populate('unitPrice');
      const { price } = parking.unitPrice;
  
      const checkinHourUTC = new Date(checkinHour).getUTCHours();
      const checkoutHourUTC = new Date(checkoutHour).getUTCHours();
      const fee = (checkoutHourUTC - checkinHourUTC) * price;
  
      return fee;
    } catch (error) {
      throw new Error(`Failed to calculate the parking fee. Error: ${error.message}`);
    }
};

const calculateExtendFee = async (checkoutHour, parkingId) => {
  try {
    const parking = await Parking.findById(parkingId).populate('unitPrice');
    const { price } = parking.unitPrice;
    
    
  } catch (error) {
    throw new Error (`Failed to calculate the extend parking fee. Error: ${err.message}`);
  }
};

export default {
    calculateFee,
    calculateExtendFee,
}