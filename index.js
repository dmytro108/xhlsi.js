/**
 * @summary Xeeder Hotel Lock System Interface module.
 * 
 * 
 * 
 * @file Module impelemens Xeeder Hotel Lock System Interface. 
 * The usage is that sends data and instructions by Socket Client according to a certain format. 
 * Xeeder hotel lock system interface (Socket Server) responds it in real time. 
 * The data is transferred by network with TCP/IP protocol.
 * 
 * @module xhlsi
 *
 * @author Dmitry A. Fedunets <dmitry.fedunets@gmail.com>
 *
 * @Created at     : 2022-08-16 14:47:35 
 * Last modified  : 2022-09-02 14:17:04
 */

const xhlsi = require('./dataset');

/**
 * @summary Formats commands accordingly to the protocol. 
 * @description Before sending the command should be formated as following:<br>
 * <strong>{start marker}{dest address}{src address}{command}[data]{end marker}</strong><br>
 * @param {string} command - A string contains command and it's data
 * @param {string} [destination = '00'] - Two numeric characters represent destination address. Currently by default 00.
 * @param {string} [source = '00'] - Two numeric characters represent source address. Currently by default 00.
 * @returns {Buffer} A bites buffer of a character data in ASCII format. 
 *  
 */
const FormatCommand = (command, destination = '00', source = '00') => {
    return command.length > 0 ? Buffer.concat([xhlsi.stx, 
                                              Buffer.alloc(destination.length, destination, 'ascii' ),
                                              Buffer.alloc(source.length, source,  'ascii' ),
                                              Buffer.alloc(command.length, command, 'ascii' ), 
                                              xhlsi.etx]) 
                                : Buffer.alloc(0,'')    
}

/**
 * @summary Formats a data field of a command.
 * @description Command may contains several data fields. Each data field starts with "|" sign, field label and data. Field label is a single ASCII character.
 * @param {commandFields} field - A data field label
 * @param {*} value - Command data, mostly ASCII string
 * @returns {string} A string formated accordingly the protocol.
 */
const FormatField = (field, value) =>{
    return `${xhlsi.rs}${field}${value}`
}

/*******************************************************************
 Check in/out time:

String in format yyyymmddhhnn, example: 200901141300
 stands for 14 Jan 2009, 13:00
*/
const FormatDateTime = (dateTime) => {
    const year  = dateTime?.getFullYear?.() ?? 0;
    if (year > 0){  
        return  year +
                ((dateTime.getMonth()+1) <=9 ? ('0' + (dateTime.getMonth()+1)) : (dateTime.getMonth()+1)) +
                (dateTime.getDate() <=9 ? ('0' + dateTime.getDate()) : dateTime.getDate()) +
                (dateTime.getHours() <=9 ? ('0' + dateTime.getHours()) : dateTime.getHours() ) +
                (dateTime.getMinutes() <=9 ? ('0' + dateTime.getMinutes()) : dateTime.getMinutes())
    }
    return ''  
}


/*************************************************************
Room number:

Each room No. is composed by 1 numeric character to 5 numeric characters, 
the room No. is separated by ',' , 8 room No. in max. For example 101,102,103
*/
const FormatRoomNumbers = (...roomNumbers) => {
    if (roomNumbers.length > 0 ){
        return roomNumbers
        .slice(0,8)
        .filter(roomNumber => roomNumber >= 0 && roomNumber <= 99999)
        .join()
    }
    return ''

}

/****************************************************************
Common doors: 

Two numeric characters represent a common door information, the maximum
 number of common door is 32(Common door number from 1 to 32). For example, 
 C010809 represent that the card can open three common door, number 1,8,9
 */ 
const FormatCommonDoors = (...doorCodes) => {
    if (doorCodes.length > 0 ){
            return doorCodes
            .slice(0,31)
            .filter(doorCode => doorCode > 0 && doorCode <= 32)
            .map(doorCode => doorCode < 10 ? `0${doorCode}` : `${doorCode}`)
            .join('')
    }
    return ''
}

/********************************************************************
Guest Name:

Character string, maxlength 50
*/
const FormatGuestName = (firstName ='', secondName = '') => {
    return `${firstName} ${secondName}`.slice(0,49);
     
}

/* -------------------------------------------------------------------

*/
const IssueKey = (keyRequest, validFromNow) => {
    return ({validFrom, validTo, 
            firstName, secondName, 
            rooms, commonDoors}) => FormatCommand(xhlsi.Commands.checkIn +
                        FormatField(xhlsi.commandFields.keyRequest, keyRequest) +
                        FormatField(xhlsi.commandFields.cardType, xhlsi.cardTypes.guest) +
                        FormatField(xhlsi.commandFields.roomNumber, FormatRoomNumbers(...rooms)) +
                        FormatField(xhlsi.commandFields.validFrom, FormatDateTime(validFromNow ? new Date(Date.now()) : validFrom)) +
                        FormatField(xhlsi.commandFields.validTo, FormatDateTime(validTo)) +
                        FormatField(xhlsi.commandFields.guestName, FormatGuestName(firstName, secondName)) +
                        FormatField(xhlsi.commandFields.commonDoors, FormatCommonDoors(...commonDoors)))
}


/**
 * @function CreateKey
 * @summary Formats a data field of a command.
 * @description Command may contains several data fields. Each data field starts with "|" sign, field label and data. Field label is a single ASCII character.
 * @param {commandFields} field - A data field label
 * @param {*} value - Command data, mostly ASCII string
 * @returns {string} A string formated accordingly the protocol.
 */
const CreateKey = IssueKey(xhlsi.keyRequests.new, false);
const ReplaceKey = IssueKey(xhlsi.keyRequests.new, true);
const DuplicateKey = IssueKey(xhlsi.keyRequests.duplicate, true);
const ErraseKey = () => FormatCommand(xhlsi.Commands.checkOut);
const ReadKey = () => FormatCommand(xhlsi.Commands.readCard);
const ErrorMessage = () => {

}

module.exports = {CreateKey,ReplaceKey,DuplicateKey,ErraseKey,ReadKey}
