/*********************************************************************
 *                                                                   *
 *   Copyright 2016 Simon M. Werner                                  *
 *                                                                   *
 *   Licensed to the Apache Software Foundation (ASF) under one      *
 *   or more contributor license agreements.  See the NOTICE file    *
 *   distributed with this work for additional information           *
 *   regarding copyright ownership.  The ASF licenses this file      *
 *   to you under the Apache License, Version 2.0 (the               *
 *   "License"); you may not use this file except in compliance      *
 *   with the License.  You may obtain a copy of the License at      *
 *                                                                   *
 *      http://www.apache.org/licenses/LICENSE-2.0                   *
 *                                                                   *
 *   Unless required by applicable law or agreed to in writing,      *
 *   software distributed under the License is distributed on an     *
 *   "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY          *
 *   KIND, either express or implied.  See the License for the       *
 *   specific language governing permissions and limitations         *
 *   under the License.                                              *
 *                                                                   *
 *********************************************************************/

'use strict';

var ACCEL_ADDRESS = 0x4c;
var ACCEL_WAKE_ADDRESS = 0x07;
var ACCEL_WAKE_BYTE = 0x01;
var ACCEL_READ_ADDRESS = 0x00;

// These are the possible bytes that are returned by the accelerometer and their
// respective values.  X & Y axis have the same values, while Z has it's own set.
var dictXY = { '0': 0.00, '1': 2.69, '2': 5.38, '3': 8.08, '4': 10.81, '5': 13.55, '6': 16.33, '7': 19.16,
               '8': 22.02, '9': 24.95, '10': 27.95, '11': 31.04, '12': 34.23, '13': 37.54, '14': 41.01,
               '15': 44.68, '16': 48.59, '17': 52.83, '18': 57.54, '19': 62.95, '20': 69.64, '21': 79.86,
               '22': 'na', '23': 'na', '24': 'na', '25': 'na', '26': 'na', '27': 'na', '28': 'shaken',
               '29': 'shaken', '30': 'shaken', '31': 'shaken', '63': -2.69, '62': -5.38, '61': -8.08,
               '60': -10.81, '59': -13.55, '58': -16.33, '57': -19.16, '56': -22.02, '55': -24.95,
               '54': -27.95, '53': -31.04, '52': -34.23, '51': -37.54, '50': -41.01, '49': -44.68,
               '48': -48.59, '47': -52.83, '46': -57.54, '45': -62.95, '44': -69.64, '43': -79.86,
               '42': 'na', '41': 'na', '40': 'na', '39': 'na', '38': 'na', '37': 'na', '36': 'shaken',
               '35': 'shaken', '34': 'shaken', '33': 'shaken', '32': 'shaken' };

var dictZ = { '0': 90.00, '1': 87.31, '2': 84.62, '3': 81.92, '4': 79.19, '5': 76.45, '6': 73.67,
              '7': 70.84, '8': 67.98, '9': 65.05, '10': 62.05, '11': 58.96, '12': 55.77, '13': 52.46,
              '14': 48.99, '15': 45.32, '16': 41.41, '17': 37.17, '18': 32.46, '19': 27.05, '20': 20.36,
              '21': 10.14, '22': 'na', '23': 'na', '24': 'na', '25': 'na', '26': 'na', '27': 'na', '28':
              'na', '29': 'na', '30': 'na', '31': 'na', '63': -87.31, '62': -84.62, '61': -81.92,
              '60': -79.19, '59': -76.45, '58': -73.67, '57': -70.84, '56': -67.98, '55': -65.05,
              '54': -62.05, '53': -58.96, '52': -55.77, '51': -52.46, '50': -48.99, '49': -45.32,
              '48': -41.41, '47': -37.17, '46': -32.46, '45': -27.05, '44': -20.36, '43': -10.14,
              '42': 'na', '41': 'na', '40': 'na', '39': 'na', '38': 'na', '37': 'na', '36': 'na',
              '35': 'na', '34': 'na', '33': 'na', '32': 'na' };

/**
 * Initalise the accelerometer.
 * @param {number}   i2cBusNum The i2c bus number.
 */
function Accelerometer(i2cBusNum) {

    if (typeof i2cBusNum !== 'number') {
        throw new Error('Accelerometer: i2cBusNum must be a number.');
    }

    this.i2c = require('i2c-bus').openSync(i2cBusNum);

    // Wake the device
    this.i2c.writeByteSync(ACCEL_ADDRESS, ACCEL_WAKE_ADDRESS, ACCEL_WAKE_BYTE);

}

/**
 * Get the raw (unscaled) values from the compass.
 * @param  {Function} callback The standard callback -> (err, {x:string, y:string, z:string})
 */
Accelerometer.prototype.getValues = function (callback) {
    var BUF_LEN = 3;
    var buf = new Buffer(BUF_LEN);
    this.i2c.readI2cBlock(ACCEL_ADDRESS, ACCEL_READ_ADDRESS, BUF_LEN, buf, function (err2) {
        if (err2) {
            callback(err2);
            return;
        }

        var x = buf[0] & 63;
        var y = buf[1] & 63;
        var z = buf[2] & 63;

        callback(null, {
            x: dictXY[x],
            y: dictXY[y],
            z: dictZ[z]
        });
    });

};


module.exports = Accelerometer;
