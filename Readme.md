# accelerometer-mma7660fc

This is a library to run the MMA7660FC accelerometer via the i2c bus.  It has tested on the BeagleBone Series, but it should also work for the Raspberry Pi.

Install:

```bash
npm install accelerometer-mma7660fc
```

Using it:

```javascript
var MMA7660FC = require('accelerometer-mma7660fc');

// The initialiser is the i2c bus number that the accelerometer is on.
var accelerometer = new MMA7660FC(2);

// Get the accelerometer values - an object with x, y, z values which represent
// the G Force in the respective direction.
accelerometer.getValues(function (err, values) {
    console.log(values);      // { x: -0.047, y: -0.281, z: 0.938 }
});
```

# Further reading
- [Technical documentation (datasheet) for the MMA7660FC](http://www.farnell.com/datasheets/1670762.pdf)

# To Do for v1.0.0
- [Implement noise reduction](http://stackoverflow.com/questions/1638864/filtering-accelerometer-data-noise).


## License

Copyright 2016 Simon M. Werner

Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements.  See the NOTICE file distributed with this work for additional information regarding copyright ownership.  The ASF licenses this file to you under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  You may obtain a copy of the License at

  [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the License for the specific language governing permissions and limitations under the License.
