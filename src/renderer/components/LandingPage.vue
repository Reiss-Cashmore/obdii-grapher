<template>
  <div>
    <main>
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-md-4">
            <h3>Connected: {{connected}}</h3>
            <b-form-group id="deviceSelectGroup" label="OBD Device:" label-for="deviceSelect">
              <b-form-select
                id="deviceSelect"
                :disabled="connected"
                :options="discoveredDevices"
                v-model="selectedDeviceAddress"
                value-field="address"
                text-field="name"
              ></b-form-select>
            </b-form-group>
            <b-form-group
              id="deviceChannelSelectGroup"
              label="Comm Channel:"
              label-for="deviceChannelSelect"
            >
              <b-form-select
                id="deviceChannelSelect"
                :disabled="connected"
                :options="selectedDeviceServices"
                v-model="selectedDeviceChannel"
                text-field="name"
                value-field="channel"
              ></b-form-select>
            </b-form-group>
            <button
              type="button"
              v-if="!connected"
              @click="connectToDevice() "
              class="btn btn-primary btn-lg btn-block"
            >Connect</button>
            <button
              type="button"
              v-if="connected"
              @click="disconnect() "
              class="btn btn-danger btn-lg btn-block"
            >Disconnect</button>
            <GChart type="LineChart" :data="receivedData" @ready="setupChart"/>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import SystemInformation from "./LandingPage/SystemInformation";

export default {
  name: "landing-page",
  components: { SystemInformation },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      connected: state => state.obd.connected,
      discoveredDevices: state => state.obd.discoveredDevices,
      selectedDeviceServices: state => state.obd.selectedDeviceServices,
      receivedData: state => state.obd.receivedData
    }),
    selectedDeviceAddress: {
      get() {
        return this.$store.state.obd.selectedDeviceAddress;
      },
      set(val) {
        this.$store.dispatch("obd/setSelectedDeviceAddress", val);
      }
    },
    selectedDeviceChannel: {
      get() {
        return this.$store.state.obd.selectedDeviceChannel;
      },
      set(val) {
        this.$store.dispatch("obd/setSelectedDeviceChannel", val);
      }
    }
  },
  created() {
    this.resetOBDConnection();
    this.scanForDevices();
  },
  methods: {
    ...mapActions({
      scanForDevices: "obd/scanForDevices",
      connectToDevice: "obd/attemptConnection",
      resetOBDConnection: "obd/resetOBDConnection",
      disconnect: "obd/resetOBDConnection"
    }),
    setupChart(chart, google) {
      const data = new google.visualization.DataTable();

      data.addColumn("number", "time");
      data.addColumn("number", "value");
    },

    open(link) {
      this.$electron.shell.openExternal(link);
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

body {
  font-family: "Source Sans Pro", sans-serif;
}

main {
  display: flex;
  justify-content: space-between;
}
</style>