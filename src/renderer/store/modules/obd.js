import OBDReader from "../../services/obd";
var moment = require('moment');
const btSerial = new(require("bluetooth-serial-port")).BluetoothSerialPort();
var btOBDReader = new OBDReader();
export default {
  namespaced: true,
  state: {
    discoveredDevices: [],
    selectedDeviceAddress: null,
    selectedDeviceChannel: null,
    selectedDeviceServices: [],
    connected: false,
    receivedData: []
  },
  actions: {
    resetOBDConnection({
      commit,
      state,
      dispatch
    }) {

      var now = moment().toISOString();
      commit("setDiscoveredDevices", []);
      commit("setSelectedDeviceAddress", null);
      commit("setSelectedDeviceServices", []);
      commit("setSelectedDeviceChannel", null);
      commit("setDataLogs", [
        ['time', 'value'],
        [now, 0]
      ]);
      if (btOBDReader.connected == true) {

        btOBDReader.disconnect();

      }
      commit("setConnectedState", false);
      dispatch("scanForDevices");
    },
    scanForDevices({
      commit
    }) {
      btSerial.listPairedDevices(list => {

        commit("setDiscoveredDevices", list);
      });
    },
    attemptConnection({
      commit,
      state,
      dispatch
    }) {
      if (!state.connected) {
        btOBDReader.connect(state.selectedDeviceAddress, state.selectedDeviceChannel);
        btOBDReader.on('dataReceived', function (data) {

          commit("addDataLog", [moment().toISOString(), data.value])
        });

        btOBDReader.on('connected', function () {

          this.addPoller("rpm");
          this.startPolling(1000);
          commit("setConnectedState", true);
        });
        btOBDReader.on('failure', function (err) {
          console.log(err)
        });
        btOBDReader.on('error', function (err) {
          console.log(err)
        });


      }
    },
    setSelectedDeviceAddress({
      commit,
      state
    }, address) {
      commit("setSelectedDeviceAddress", address);
      commit("setSelectedDeviceServices", []);
      var services = []
      state.discoveredDevices.forEach((device) => {
        if (device.address === address) services = device.services;
      })
      commit("setSelectedDeviceServices", services);
    },
    setSelectedDeviceChannel({
      commit
    }, channel) {
      commit("setSelectedDeviceChannel", channel)
    },
    setDiscoveredDevices({
      commit
    }, devices) {
      commit("setDiscoveredDevices", devices);
    }
  },
  mutations: {
    setDataLogs(state, dataLogs) {
      state.receivedData = dataLogs;
    },
    addDataLog(state, data) {
      state.receivedData.push(data);
    },
    setSelectedDeviceAddress(state, address) {
      state.selectedDeviceAddress = address;
    },
    setSelectedDeviceServices(state, services) {
      state.selectedDeviceServices = services;
    },
    setSelectedDeviceChannel(state, channel) {
      state.selectedDeviceChannel = channel;
    },
    setDiscoveredDevices(state, devices) {
      state.discoveredDevices = devices;
    },
    setConnectedState(state, connected) {
      state.connected = connected;
    }
  },

};