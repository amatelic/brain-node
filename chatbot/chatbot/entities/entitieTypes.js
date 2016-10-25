//desination(City, adress), time,
let email = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
);
module.exports = {
  ['@day']: {
    priority: 2,
    fn: (text) =>  ['yesterday', 'tommorow', 'today'].includes(text)
  },
  ['@number']: {
    priority: 1,
    fn: (text) =>  !isNaN(parseFloat(text)) && isFinite(text)
  },
  ['@bool']: {
    priority: 1,
    fn: (text) =>  ['yes', 'no'].includes(text)
  },

  ['@email']: {
    priority: 1,
    fn: (text) => email.test(text),

  },

  ['@task']: {
    priority: 3,
    fn: (text) =>  ['basketball', 'footbal', 'running', 'cooking', 'working on computers'].includes(text)
  },
}
