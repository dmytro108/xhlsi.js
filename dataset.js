/**
 * @summary Data settings for Xeeder Hotel Lock System Interface module.
 * 
 * @file Defines all data for Xeeder Hotel Lock System Interface module such as 
 * command names, start/stop markers, etc.
 * @module xhlsi
 *
 * @author Dmitry A. Fedunets <dmitry.fedunets@gmail.com>
 *
 * @Created at     : 2022-08-16 14:47:35 
 * Last modified  : 2022-09-02 12:36:54
 */

/**
@summary Defining the Control Characters that can be sent to the key encoder.
    STX (0x02): It's used to label the start of data records.
    ETX (0x03): It's used to label the end of data records.
    RS (0x7C), '|' : It's used to label the start of new field (region). 
                     The field label code follows it.
*/

exports.stx = Buffer.alloc(1,2);
exports.etx = Buffer.alloc(1,3);
exports.rs = '|';

/******************************************************
Command code: 
two characters, ASCII code, specify the performing command.
*/

/*  */
exports.Commands = {
    checkIn:  '0I', // guest check in (issue card)
    checkOut: '0B', // guest check out (erase card)
    readCard: '0E'  // read card
}

/*******************************************************
Data region (data):
    The data region gives different data according to the requirement. 
    The format is <FI>data.
    <FI> - field label, 1 byte, ASCII code, to label the region data's meaning.
*/
exports.commandFields = {
    roomNumber:  'R', // Room numbers to access for the guest. Required field.
    validFrom:   'D', // Date and time the card is valid from. Required field.
    validTo:     'O', // Date and time the card is valid to. Required field.
    cardType:    'T', // Card type (guest, master, setup, etc). Required field.
    guestName:   'N', // Guest name. Optional field.
    commonDoors: 'C', // Common doors numbers to access for the guest. Optional field.
    cardID:      'M', // Uniq card number. Used for card reading
    keyRequest:  'V'  // Request for a key which cancels al privious keys. Optional field.
}

/**********************************************************
Presets: 

    */
exports.cardTypes = {
    guest: '04', // Guest type card
    master: '01'
}

exports.keyRequests = {
    new:       'N', // New key request. Cancels any existing keys.
    duplicate: 'D'  // Duplicate key request. Any existing keys remain valid.
}

/******************************************************
Answer code: 2 numeric characters, ASCII code, 
    specify the result of performance.
*/


exports.ErrorCodes =[
    {errno: '00', message: 'Ok'},
    {errno: '01', message: 'No card'},
    {errno: '02', message: 'No encoder found'},
    {errno: '03', message: 'Invalid card'},
    {errno: '04', message: 'Card type error'},
    {errno: '05', message: 'Card read/write error'},
    {errno: '06', message: 'Com port is not open'},
    {errno: '07', message: 'Read Query card ok'},
    {errno: '08', message: 'Invalid parameter'},
    {errno: '09', message: 'Operating not support'},
    {errno: '10', message: 'Other error'},
    {errno: '11', message: 'Port is in using'},
    {errno: '12', message: 'Communication error'},
    {errno: '13', message: 'Card is not empty, revoke it firstly'},
    {errno: '14', message: 'Failed! Card Encryption is unknown'},
    {errno: '15', message: 'Operating failed'},
    {errno: '16', message: 'Unknown error'},
    {errno: '17', message: 'Card count over limit'},
    {errno: '18', message: 'Invalid room number'},
    {errno: '19', message: 'Please input one room number'},
    {errno: '20', message: 'Empty card'},
    {errno: '23', message: 'Not Guest Card'}
];
