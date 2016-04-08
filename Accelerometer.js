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

/*
 * Technical documentation:
 * http://www.farnell.com/datasheets/1670762.pdf
 */

var ACCEL_ADDRESS = 0x4c;
var ACCEL_WAKE_ADDRESS = 0x07;
var ACCEL_WAKE_BYTE = 0x01;
var ACCEL_READ_ADDRESS = 0x00;

// These are the possible bytes that are returned by the accelerometer and their
// respective values.  X & Y axis have the same values, while Z has it's own set.
var gForce = [0, 0.047, 0.094, 0.141, 0.188, 0.234, 0.281, 0.328, 0.375, 0.422,
    0.469, 0.516, 0.563, 0.609, 0.656, 0.703, 0.75, 0.797, 0.844, 0.891, 0.938,
    0.984, 1.031, 1.078, 1.125, 1.172, 1.219, 1.266, 1.313, 1.359, 1.406, 1.453,
    -1.5, -1.453, -1.406, -1.359, -1.313, -1.266, -1.219, -1.172, -1.125,
    -1.078, -1.031, -0.984, -0.938, -0.891, -0.844, -0.797, -0.75, -0.703,
    -0.656, -0.609, -0.563, -0.516, -0.469, -0.422, -0.375, -0.328, -0.281,
    -0.234, -0.188, -0.141, -0.094, -0.047];

/**
 * Initalise the accelerometer.
 * @param {number}  i2cBusNum The i2c bus number.
 * @param {object}  options   The additional options.
 *
 * Options:
 *   i2c: the i2c library (such that we don't have to load it twice).
 */
function Accelerometer(i2cBusNum, options) {

    if (typeof i2cBusNum !== 'number') {
        throw new Error('Accelerometer: i2cBusNum must be a number.');
    }

    if (!options) {
        options = {};
    }
    this.i2c = (options.i2c || require('i2c-bus')).openSync(i2cBusNum);

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

    try {
        this.i2c.readI2cBlock(ACCEL_ADDRESS, ACCEL_READ_ADDRESS, BUF_LEN, buf, i2cCallback);
    } catch (ex) {
        console.error('ERROR: Accelerometer.getValues(): error with i2c.readI2cBlock: ', ex);
        if (callback) {
            callback(ex);
            callback = null;
        }
    }

    function i2cCallback(err) {

        if (!callback) {
            return;
        }

        if (err) {
            callback(err);
        } else {
            var x = buf[0] & 0x3f;
            var y = buf[1] & 0x3f;
            var z = buf[2] & 0x3f;

            callback(null, {
                x: gForce[x],
                y: gForce[y],
                z: gForce[z]
            });
        }
        callback = null;

    }

};


module.exports = Accelerometer;
