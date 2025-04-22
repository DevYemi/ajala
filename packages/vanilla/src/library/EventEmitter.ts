class EventEmitter<EventType extends string> {
  private _listeners?: Record<EventType, Function[]>;

  /**
   * Adds the given event listener to the given event type.
   *
   * @param type - The type of event to listen to.
   * @param listener - The function that gets called when the event is fired.
   */
  addEventListener(type: EventType, listener: (event: Event) => void): void {
    if (this._listeners === undefined) this._listeners = {} as any;

    const listeners = this._listeners!;

    if (listeners[type] === undefined) {
      listeners[type] = [];
    }

    if (listeners[type].indexOf(listener) === -1) {
      listeners[type].push(listener);
    }
  }

  /**
   * Removes the given event listener from the given event type.
   *
   * @param type - The type of event.
   * @param listener - The listener to remove.
   */
  removeEventListener(type: EventType, listener: (event: Event) => void): void {
    const listeners = this._listeners;

    if (listeners === undefined) return;

    const listenerArray = listeners[type];

    if (listenerArray !== undefined) {
      const index = listenerArray.indexOf(listener);

      if (index !== -1) {
        listenerArray.splice(index, 1);
      }
    }
  }

  /**
   * Dispatches an event object.
   *
   * @param event - The event that gets fired.
   */
  dispatchEvent<T>(event: { type: EventType; data: T }): void {
    const listeners = this._listeners;

    if (listeners === undefined) return;

    const listenerArray = listeners[event.type];

    if (listenerArray !== undefined) {
      // Make a copy, in case listeners are removed while iterating.
      const array = listenerArray.slice(0);

      for (let i = 0, l = array.length; i < l; i++) {
        array[i].call(this, event);
      }
    }
  }
}

export default EventEmitter;
