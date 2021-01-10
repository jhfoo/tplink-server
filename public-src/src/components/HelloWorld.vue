<template>
  <div>
    <v-container class="pa-0 ma-0" fluid>
      <v-row>
        <v-col cols="12" md="2">
          xx
        </v-col>

        <v-col cols="12" md="7">
          <v-toolbar dark flat dense src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">
            <v-toolbar-title>Vuetify</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-toolbar-items>
            </v-toolbar-items>
              <v-checkbox v-model="FakeLed" disabled class="pt-5"></v-checkbox>
              <v-switch v-model="isAutoRefresh" @change="onToggleAutoRefresh" label="Auto" :color="AutoRefreshColor" class="pt-5"></v-switch>
            <v-btn @click="updateDevices(true)" icon :disabled="isAutoRefresh">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-toolbar>
          <v-data-table :headers="TableLabels" :items="devices">
            <template v-slot:item.actions="{ item }">
              <v-icon @click="showDeviceDetail(item)">mdi-file-find-outline</v-icon>
              <v-icon v-if="item.RelayState !== ''" @click="onToggleOnOff(item)">{{ getRelayIcon(item) }}</v-icon>
            </template>
          </v-data-table>
        </v-col>

        <v-col cols="12" md="3">
          xx
        </v-col>
      </v-row>
      </v-container>
      <v-bottom-sheet v-model="isShowSheet" inset>
        <v-sheet class="text-center">
          <v-simple-table fixed-header height="400px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-right">Property</th>
                    <th class="text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pair in SelectedDevice" v-bind:key="pair.key">
                    <td class="text-right">{{ pair.key }}</td>
                    <td class="text-left">{{ pair.value }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          <v-btn class="mt-6" text color="error" @click="isShowSheet = false">close</v-btn>
        </v-sheet>
      </v-bottom-sheet>
  </div>
</template>

<script>
import axios from 'axios'
const REFRESH_TIMEOUT = 5 * 1000,
  RELAY_ON = 'ON',
  RELAY_OFF = 'OFF',
  RELAY_UNKNOWN = '',
  API_BASEURL = 'http://192.168.80.15:8080'

  export default {
    name: 'HelloWorld',
    data: () => ({
      devices: [],
      isAutoRefresh: true,
      RefreshTimer: null,
      isApiAvail: true,
      FakeLed: true,
      isShowSheet: false,
      SelectedDevice: null,
      TableLabels:[
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'model' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions' },
      ],
    }),
    mounted() {
      this.updateDevices()
    },
    unmounted() {
      clearTimeout(this.RefreshTimer)
      this.isAutoRefresh = false
      this.RefreshTimer = null
    },
    computed: {
      AutoRefreshColor() {
        return this.isApiAvail ? 'success' : 'error'
      }
    },
    methods: {
      showDeviceDetail(device) {
        this.SelectedDevice = []
        Object.keys(device).forEach((key) => {
          this.SelectedDevice.push({
            key: key,
            value: device[key]
          })
        })
        console.log(device)
        console.log(this.SelectedDevice)
        this.isShowSheet = true
      },
      getRelayIcon(item) {
        return item.RelayState === RELAY_ON ? 'mdi-lightbulb-on' : 'mdi-lightbulb-outline'
      },
      onToggleOnOff(item) {
        if ('RelayState' in item) {
          // validate device is a relay
          let GetUrl, NewState
          if (item.RelayState === RELAY_ON) {
            // ON: turn off
            GetUrl = `${API_BASEURL}/api/device/${item.host}/relay/off`
            NewState = RELAY_OFF
          } else {
            // OFF: turn on
            GetUrl = `${API_BASEURL}/api/device/${item.host}/relay/on`
            NewState = RELAY_ON
          }

          axios.get(GetUrl)
          .then((resp) => {
            if (resp.data === true) {
              // update device 
              this.devices[item.host].RelayState = NewState
            }
          })
          .catch((err) => {
            console.log(err)              
          })
        }
      },
      onToggleAutoRefresh() {
        if (this.isAutoRefresh) {
          // turn on
          this.updateDevices()
        }
      },
      updateDevices(isForce) {
        if (!isForce && !this.isAutoRefresh) {
          return
        }

        this.FakeLed = true
        let DelayedLedStart = new Date()

        axios.get('http://192.168.80.15:8080/api/device/list')
        .then((resp) => {
          this.devices = Object.keys(resp.data).map((key) => {
            // console.log(resp.data[key])
            let device = {
              host: key,
              model: '',
              name: '',
              RelayState: RELAY_UNKNOWN,
              LastScan: ''
            }
            if (resp.data[key].err_code === 0) {
              device.status = 'ALIVE'

              let DeviceInfo = resp.data[key]
              if ('relay_state' in DeviceInfo) {
                device.RelayState = resp.data[key].relay_state ? RELAY_ON : RELAY_OFF
              }
              device.model = `${resp.data[key].dev_name} - ${resp.data[key].model}` 
              device.name = resp.data[key].alias
              device.LastScan = resp.data[key].LastScan
              device.mac = resp.data[key].mac
              device.DeviceId = resp.data[key].deviceId
            } else {
              device.status = 'UNKNOWN'
            }

            this.isApiAvail = true
            return device
          })
        })
        .catch((err) => {
          this.isApiAvail = false
          console.error(err);
        })
        .finally(() => {
          const MIN_LED_DELAY = 200
          let diff = (new Date()) - DelayedLedStart
          if (diff > MIN_LED_DELAY) {
            this.FakeLed = false
          } else {
            setTimeout(() => {
              this.FakeLed = false
            }, MIN_LED_DELAY - diff)
          }

          if (this.isAutoRefresh) {
            this.RefreshTimer = setTimeout(() => {
              this.updateDevices()
            }, REFRESH_TIMEOUT)
          }
        })
      }
    }
  }
</script>
