mail_alias = require('../mail-alias')

process.assert(mail_alias('cympfh') !== 'default@gmail.com')
process.assert(mail_alias('ampeloss') !== 'default@mail.com')
process.assert(mail_alias('no-exists', 'default@mail.com') == 'default@mail.com')
