import { inject, Factory } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';

@inject(Factory.of(HttpClient))
export class Api {
  constructor(Http) {
    this.http = new Http;
    const baseUrl = 'http://localhost:1337/api';
    this.http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl(baseUrl)
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'X-Requested-With': 'Fetch'
          }
        });
    });
  }

  read(endpoint) {
    return this.http.fetch('/' + endpoint)
      .then(response => {
        return response.json();
      })
      .then(data => {
        // LOGGER: successful get
        return data;
      })
      .catch(() => { throw new Error('network error'); });
  }

  update(endpoint, content) {
    console.log(content);
    return this.http.fetch('/' + endpoint, {
      method: 'put',
      body: json(content)
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        // LOGGER: successful sent and saved
        if (data.insertId) {
          console.log(data.insertId + ' successfully updated.')
          return data.insertId;
        }
        console.log(data.length + ' items successfully updated.');
        return data;
      })
      // LOGGER: error saved
      .catch(() => { throw new Error('network error'); });
  }

  create(resourcetype, content) {
    console.log(json(content));
    return this.http.fetch('/' + resourcetype, {
      method: 'post',
      body: json(content)
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        // LOGGER: successful sent and saved
        if (data.insertId) {
          console.log(data.insertId + ' successfully saved.')
          return data.insertId;
        }
        console.log(data.length + ' items successfully saved.');
        return data;
      })
      // LOGGER: error saved
      .catch(() => { throw new Error('network error'); });
  }

  delete(resourcetype, content) {
    return this.http.fetch('/' + resourcetype, {
      method: 'delete',
      body: json(content)
    })
      .then(response => {
        return response;
      })
      .then(data => {
        // LOGGER: successful sent and saved
        console.log(data.status + ' successfully deleted.');
        return data;
      })
      // LOGGER: error saved
      .catch(() => { throw new Error('network error'); });
  }
}
