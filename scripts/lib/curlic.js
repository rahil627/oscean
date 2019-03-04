'use strict'

function curlic (text = '', host) {
  
  function validate (t) {
    if (t.indexOf('(') > -1 && t.indexOf(')') < 0) { console.warn(`Missing closing(:${t}`) }
    if (t.indexOf('[') > -1 && t.indexOf(']') < 0) { console.warn(`Missing closing[:${t}`) }
    if (t.indexOf('{') > -1 && t.indexOf('}') < 0) { console.warn(`Missing closing{:${t}`) }
  }

  function heol (t) {
    return new Heol(t, Ø('database').cache, host)
  }

  function link (s, t) {
    const target = t.substr(1, t.length - 2).trim()
    const external = target.indexOf('//') > -1
    const name = s.replace(`(${target})`, '').trim()
    const location = target.toLowerCase().replace(/ /g, '+').replace(/[^0-9a-z\+\:\-\.\/]/gi, '').trim()

    console.log(s,t)
    return `<a href='${external ? target : 'index.html#' + location}' target='${external ? '_blank' : '_self'}' class='${external ? 'external' : 'local'}' data-goto='${external ? '' : target}'>${name || target}</a>`
  }

  function parse (s) {
    validate(s)

    const toHeol = s.substr(0, 1) === 'λ'
    if (toHeol) { s = s.replace(s, heol(s.substr(1))) }

    const toLink = s.match(/\((.*)\)/g)
    if (toLink) { s = s.replace(toLink[0], '') }

    if (toLink) {
      s = link(s, toLink[0])
    }

    return s
  }

  function extract (text) {
    return text.match(/[^{\}]+(?=})/g)
  }

  const matches = extract(text)

  if (!matches) { return text }

  matches.forEach(el => {
    text = text.replace(`{${el}}`, parse(el))
  })

  return text
}

String.prototype.toCurlic = function (host) { return `${curlic(this, host)}` }
