/**
 *   Wechaty - https://github.com/wechaty/wechaty
 *
 *   @copyright 2016-now Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
 import 'dotenv/config.js'

 import {
  WechatyBuilder,
  ScanStatus,
  log,
}                     from 'wechaty'
import qrcodeTerminal from 'qrcode-terminal'

const TOPIC = "TDD pair"

function onScan (qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin (user) {
  log.info('StarterBot', '%s login', user)
}

function onLogout (user) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage (msg) {
  log.info('StarterBot', msg.toString())

  const room = msg.room()
  if (!room) {
    return
  }

  const topic = await room.topic()
  if (topic === TOPIC) {
    if (msg.text() === 'hi') {
      await msg.say("What can I do for you?")
    }
  }
}

const bot = WechatyBuilder.build({
  name: 'wechat-assistant',
  puppetOptions: {
    tls: {
      disable: false
    },
    token: "puppet_padlocal_6d1a3ae013a44353a1921374fc1e5f34" // !!!!! Please change it !!!!!
  },
  /**
   * How to set Wechaty Puppet Provider:
   *
   *  1. Specify a `puppet` option when instantiating Wechaty. (like `{ puppet: 'wechaty-puppet-padlocal' }`, see below)
   *  1. Set the `WECHATY_PUPPET` environment variable to the puppet NPM module name. (like `wechaty-puppet-padlocal`)
   *
   * You can use the following providers:
   *  - wechaty-puppet-wechat (no token required)
   *  - wechaty-puppet-padlocal (token required)
   *  - wechaty-puppet-service (token required, see: <https://wechaty.js.org/docs/puppet-services>)
   *  - etc. see: <https://github.com/wechaty/wechaty-puppet/wiki/Directory>
   */
  puppet: 'wechaty-puppet-padlocal',
})

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
  .then(async () => {
    log.info('StarterBot', 'Starter Bot Started.')
    // const room = await bot.Room.find({topic: TOPIC}) // change `event-room` to any room topic in your wechat
    // if (room) {
    //   room.on('join', async (room, inviteeList, inviter) => {
    //     const nameList = inviteeList.map(c => c.name()).join(',')
    //     // console.log(`Room got new member ${nameList}, invited by ${inviter}`)
    //     await room.say(`欢迎${nameList}加入直播间！`)
    //   })
    // }
  })
  .catch(e => log.error('StarterBot', e))

