const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Audio Hosting Platform API',
      version: '1.0.0',
      description: 'A comprehensive API for audio file hosting and management',
      contact: {
        name: 'S&S COE Development Team',
        email: 'dev@audiohosting.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.audiohosting.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email'],
          properties: {
            id: {
              type: 'integer',
              description: 'User unique identifier'
            },
            username: {
              type: 'string',
              description: 'Username for login',
              minLength: 3,
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        AudioFile: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Audio file unique identifier'
            },
            user_id: {
              type: 'integer',
              description: 'Owner user ID'
            },
            filename: {
              type: 'string',
              description: 'System generated filename'
            },
            original_name: {
              type: 'string',
              description: 'Original uploaded filename'
            },
            file_path: {
              type: 'string',
              description: 'Server file path'
            },
            description: {
              type: 'string',
              description: 'User provided description',
              maxLength: 500
            },
            category: {
              type: 'string',
              enum: ['music', 'podcast', 'audiobook', 'sound-effect', 'voice-recording', 'other'],
              description: 'Audio file category'
            },
            file_size: {
              type: 'integer',
              description: 'File size in bytes'
            },
            duration: {
              type: 'integer',
              description: 'Duration in seconds',
              nullable: true
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Upload timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'User login username'
            },
            password: {
              type: 'string',
              description: 'User password'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login successful'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            token: {
              type: 'string',
              description: 'JWT authentication token'
            }
          }
        },
        CreateUserRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string',
              minLength: 6
            }
          }
        },
        UpdateUserRequest: {
          type: 'object',
          required: ['username', 'email'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email'
            }
          }
        },
        AudioUploadResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Audio file uploaded successfully'
            },
            audio: {
              $ref: '#/components/schemas/AudioFile'
            }
          }
        },
        AudioListResponse: {
          type: 'object',
          properties: {
            audioFiles: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/AudioFile'
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Detailed error information'
            }
          }
        }
      }
    },
    security: [
      {
        sessionAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};