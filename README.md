![HTTP Rails Logo](https://github.com/minidogg/http-rails/assets/117037081/a4d8e7b7-4354-4966-811e-b59f500eee4c)

# HTTP Rails
[![npm version](https://badge.fury.io/js/http-rails.svg)](https://www.npmjs.com/package/http-rails)
[![GitHub issues](https://img.shields.io/github/issues/minidogg/http-rails.svg)](https://github.com/minidogg/http-rails/issues)
[![GitHub license](https://img.shields.io/github/license/minidogg/http-rails.svg)](https://github.com/minidogg/http-rails/blob/main/LICENSE)
[![npm downloads](https://img.shields.io/npm/dt/http-rails.svg)](https://www.npmjs.com/package/http-rails)
[![GitHub contributors](https://img.shields.io/github/contributors/minidogg/http-rails.svg)](https://github.com/minidogg/http-rails/graphs/contributors)

HTTP Rails is a lightweight, Express.js-inspired framework for building web applications in Node.js. With HTTP Rails, you can quickly set up routes, handle requests, and manage responses, allowing you to focus on building your application logic.

## Features

- **Express.js Compatibility**: HTTP Rails follows a similar syntax and structure to Express.js, making it easy for you (familiar with Express) to transition!
  
- **Simplicity**: HTTP Rails is designed to be simple and intuitive, with minimal boilerplate code required to get started!

- **Middleware Support**: Easily integrate middleware into your application to handle tasks such as authentication, logging, and error handling!

- **Routing**: Define routes for handling HTTP requests using familiar Express.js syntax!

## Installation

You can install HTTP Rails via npm:

```bash
npm install http-rails
```

## Usage

Here's a basic example of how to create a simple HTTP Rails application:

```javascript
const { HttpRails } = require('http-rails');

const app = new HttpRails();

app.get('/', (req, res) => {
  res.send('Hello, HTTP Rails!');
});

app.listen(3000, () => {
  console.log('HTTP Rails app listening on port 3000');
});
```

## Documentation

For detailed usage instructions and API reference, please refer to the [documentation](https://www.npmjs.com/package/http-rails).


## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/minidogg/http-rails).

## Help

If you need any assistance or have questions about HTTP Rails, feel free to reach out on our [Discord server](#).

