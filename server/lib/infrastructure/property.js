import {EventEmitter} from 'events'

/**
 * This class represents a property
 */
export default class Property extends EventEmitter {
  constructor () {
    super()

    this._node = null

    this._id = null
    this._value = null
    this._settable = null

    this.db = new Map([
      ['exist', false],
      ['id', null]
    ])

    this.isValid = false

    Object.seal(this)
  }

  get node () { return this._node }
  set node (val) {
    if (!val || this._node === val) return
    this._node = val
    this._wasUpdated()
  }
  get id () { return this._id }
  set id (val) {
    if (!val || this._id === val) return
    this._id = val
    this._wasUpdated()
  }
  get value () { return this._value }
  set value (val) {
    if (!val || this._value === val) return
    this._value = val; this._wasUpdated()
  }
  get settable () { return this._settable }
  set settable (val) {
    if (typeof val === undefined || this._value === val) return
    this._settable = val; this._wasUpdated()
  }

  _wasUpdated () {
    const wasValid = this.isValid
    this.isValid = (
      this._node !== null &&
      this._id !== null &&
      this._value !== null &&
      this._settable !== null
    )

    if (!wasValid && this.isValid) {
      if (this._node.device.isValid) this.emit('valid')
      else {
        this._node.device.once('valid', () => {
          this.emit('valid')
        })
      }
    }

    if (this.isValid) this.emit('update', { type: 'property' })
  }

  toJSON () {
    const representation = {}
    representation.id = this.id
    representation.value = this.value
    representation.settable = this.settable

    return representation
  }
}
