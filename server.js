var PORT = 20127;
var HOST = '0.0.0.0';

const express = require('express');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

let obj = {};

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    let jump = 0;

    obj.isRaceOn = message.readInt32LE(jump);
    jump += 4;
    obj.timestampMS = message.readUInt32LE(jump); //Getting wrong data
    jump += 4;
    obj.engineMaxRpm = message.readFloatLE(jump);
    jump += 4;
    obj.engineIdleRpm = message.readFloatLE(jump);
    jump += 4;
    obj.currentEngineRpm = message.readFloatLE(jump);
    jump += 4;

    obj.accelerationX = message.readFloatLE(jump); //In the car's local space; X = right, Y = up, Z = forward
    jump += 4;
    obj.accelerationY = message.readFloatLE(jump);
    jump += 4;
    obj.accelerationZ = message.readFloatLE(jump);
    jump += 4;

    obj.velocityX = message.readFloatLE(jump); //In the car's local space; X = right, Y = up, Z = forward
    jump += 4;
    obj.velocityY = message.readFloatLE(jump);
    jump += 4;
    obj.velocityZ = message.readFloatLE(jump);
    jump += 4;

    obj.angularVelocityX = message.readFloatLE(jump); //In the car's local space; X = pitch, Y = yaw, Z = roll
    jump += 4;
    obj.angularVelocityY = message.readFloatLE(jump);
    jump += 4;
    obj.angularVelocityZ = message.readFloatLE(jump);
    jump += 4;

    obj.yaw = message.readFloatLE(jump);
    jump += 4;
    obj.pitch = message.readFloatLE(jump);
    jump += 4;
    obj.roll = message.readFloatLE(jump);
    jump += 4;

    obj.normalizedSuspensionTravelFrontLeft = message.readFloatLE(jump); // Suspension travel normalized: 0.0f = max stretch; 1.0 = max compression
    jump += 4;
    obj.normalizedSuspensionTravelFrontRight = message.readFloatLE(jump);
    jump += 4;
    obj.normalizedSuspensionTravelRearLeft = message.readFloatLE(jump);
    jump += 4;
    obj.normalizedSuspensionTravelRearRight = message.readFloatLE(jump);
    jump += 4;

    obj.tireSlipRatioFrontLeft = message.readFloatLE(jump); // Tire normalized slip ratio, = 0 means 100% grip and |ratio| > 1.0 means loss of grip.
    jump += 4;
    obj.tireSlipRatioFrontRight = message.readFloatLE(jump);
    jump += 4;
    obj.tireSlipRatioRearLeft = message.readFloatLE(jump);
    jump += 4;
    obj.tireSlipRatioRearRight = message.readFloatLE(jump);
    jump += 4;

    obj.wheelRotationSpeedFrontLeft = message.readFloatLE(jump); // Wheel rotation speed radians/sec.
    jump += 4; 
    obj.wheelRotationSpeedFrontRight = message.readFloatLE(jump);
    jump += 4;
    obj.wheelRotationSpeedRearLeft = message.readFloatLE(jump);
    jump += 4;
    obj.wheelRotationSpeedRearRight = message.readFloatLE(jump);
    jump += 4;

    obj.wheelOnRumbleStripFrontLeft = message.readFloatLE(jump); // = 1 when wheel is on rumble strip, = 0 when off.
    jump += 4;
    obj.wheelOnRumbleStripFrontRight = message.readFloatLE(jump);
    jump += 4;
    obj.wheelOnRumbleStripRearLeft = message.readFloatLE(jump);
    jump += 4;
    obj.wheelOnRumbleStripRearRight = message.readFloatLE(jump);
    jump += 4;

    obj.wheelInPuddleDepthFrontLeft = message.readFloatLE(jump); // = from 0 to 1, where 1 is the deepest puddle
    jump += 4;
    obj.wheelInPuddleDepthFrontRight = message.readFloatLE(jump);
    jump += 4;
    obj.wheelInPuddleDepthRearLeft = message.readFloatLE(jump);
    jump += 4;
    obj.wheelInPuddleDepthRearRight = message.readFloatLE(jump);
    jump += 4;

    obj.surfaceRumbleFrontLeft = message.readFloatLE(jump); // Non-dimensional surface rumble values passed to controller force feedback
    jump += 4;
    obj.surfaceRumbleFrontRight = message.readFloatLE(jump);
    jump += 4;
    obj.surfaceRumbleRearLeft = message.readFloatLE(jump);
    jump += 4;
    obj.surfaceRumbleRearRight = message.readFloatLE(jump);
    jump += 4;

    obj.tireSlipAngleFrontLeft = message.readFloatLE(jump); // Tire normalized slip angle, = 0 means 100% grip and |angle| > 1.0 means loss of grip.
    jump += 4;
    obj.tireSlipAngleFrontRight = message.readFloatLE(jump);
    jump += 4;
    obj.tireSlipAngleRearLeft = message.readFloatLE(jump);
    jump += 4;
    obj.tireSlipAngleRearRight = message.readFloatLE(jump);
    jump += 4;

    obj.tireCombinedSlipFrontLeft = message.readFloatLE(jump); // Tire normalized combined slip, = 0 means 100% grip and |slip| > 1.0 means loss of grip.
    jump += 4;
    obj.tireCombinedSlipFrontRight = message.readFloatLE(jump);
    jump += 4;
    obj.tireCombinedSlipRearLeft = message.readFloatLE(jump);
    jump += 4;
    obj.tireCombinedSlipRearRight = message.readFloatLE(jump);
    jump += 4;

    obj.suspensionTravelMetersFrontLeft = message.readFloatLE(jump); // Actual suspension travel in meters
    jump += 4;
    obj.suspensionTravelMetersFrontRight = message.readFloatLE(jump);
    jump += 4;
    obj.suspensionTravelMetersRearLeft = message.readFloatLE(jump);
    jump += 4;
    obj.suspensionTravelMetersRearRight = message.readFloatLE(jump);
    jump += 4;

    obj.carOrdinal = message.readInt32LE(jump); //Unique ID of the car make/model
    jump += 4;
    obj.carClass = message.readInt32LE(jump); //Between 0 (D -- worst cars) and 7 (X class -- best cars) inclusive 
    jump += 4;
    obj.carPerformanceIndex = message.readInt32LE(jump); //Between 100 (slowest car) and 999 (fastest car) inclusive
    jump += 4;
    obj.drivetrainType = message.readInt32LE(jump); //Corresponds to EDrivetrainType; 0 = FWD, 1 = RWD, 2 = AWD
    jump += 4;
    obj.numCylinders = message.readInt32LE(jump); //Number of cylinders in the engine
    jump += 4;

    //Position (meters)
    obj.positionX = message.readFloatLE(jump);
    jump += 4;
    obj.positionY = message.readFloatLE(jump);
    jump += 4;
    obj.positionZ = message.readFloatLE(jump);
    jump += 4;

    obj.speed = message.readFloatLE(jump); // meters per second
    jump += 4;
    obj.power = message.readFloatLE(jump); // watts
    jump += 4;
    obj.torque = message.readFloatLE(jump); // newton meter
    jump += 4;

    obj.tireTempFrontLeft = message.readFloatLE(jump);
    jump += 4;
    obj.tireTempFrontRight = message.readFloatLE(jump);
    jump += 4;
    obj.tireTempRearLeft = message.readFloatLE(jump);
    jump += 4;
    obj.tireTempRearRight = message.readFloatLE(jump);
    jump += 4;

    obj.boost = message.readFloatLE(jump);
    jump += 4;
    obj.fuel = message.readFloatLE(jump);
    jump += 4;
    obj.distanceTraveled = message.readFloatLE(jump);
    jump += 4;
    obj.bestLap = message.readFloatLE(jump); // seconds
    jump += 4;
    obj.lastLap = message.readFloatLE(jump); // seconds
    jump += 4;
    obj.currentLap = message.readFloatLE(jump); // seconds
    jump += 4;
    obj.currentRaceTime = message.readFloatLE(jump); // seconds
    jump += 4;

    obj.lapNumber = message.readUInt16LE(jump);
    jump += 2;
    obj.racePosition = message.readUInt8(jump);
    jump += 1;

    obj.accel = message.readUInt8(jump); // 0 - 255
    jump += 1;
    obj.brake = message.readUInt8(jump); // 0 - 255
    jump += 1;
    obj.clutch = message.readUInt8(jump);
    jump += 1;
    obj.handBrake = message.readUInt8(jump);
    jump += 1;
    obj.gear = message.readUInt8(jump);
    jump += 1;
    obj.steer = message.readUInt8(jump);
    jump += 1;

    obj.normalizedDrivingLine = message.readUInt8(jump);
    jump += 1;
    obj.normalizedAIBrakeDifference = message.readUInt8(jump);
    jump += 1;

    console.log(remote.address + ':' + remote.port + ' - (' + obj.isRaceOn + '), Gear:' + obj.gear + " - Power:" + obj.brake);

});

server.bind(PORT, HOST);

app.get('/',(req,res)=>{
    return res.send();
})

app.get('/data', function (req, res) {
    return res.send(obj);
});
   

app.listen(8080,()=>{
    console.log("Servidor ON");
});