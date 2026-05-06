const ID = 'id';

type PGValues = {
  type: string;
  id: string;
};

export type PGEventPayload = {
  event: 'SUCCESS' | 'FAILURE';
  id?: string;
  reasons: string[];
  message: string;
  state: string;
  type?: string;
};

export class PGEvent {
  private data: PGValues;

  constructor() {
    this.data = {
      type: 'blockly-type',
      id: '',
    };
  }

  getValues(): PGValues {
    const params = new URLSearchParams(document.location.search);
    this.data.id = params.get(ID) ?? '';
    return this.data;
  }

  postToPg(dataObject: PGEventPayload): void {
    const payload = {
      ...dataObject,
      type: this.data.type,
      id: this.data.id,
    };

    console.log('postToPg', payload);
    window.top?.postMessage(payload, '*');
  }
}
