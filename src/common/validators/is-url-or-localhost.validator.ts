import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsUrlOrLocalhost(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUrlOrLocalhost',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return true; // Es opcional
          
          if (typeof value !== 'string') return false;
          
          // Permitir localhost y 127.0.0.1 en desarrollo
          if (value.includes('localhost') || value.includes('127.0.0.1')) {
            try {
              const url = new URL(value);
              return ['http:', 'https:'].includes(url.protocol);
            } catch {
              return false;
            }
          }
          
          // Validar URLs normales (HTTPS/HTTP)
          try {
            const url = new URL(value);
            return ['http:', 'https:'].includes(url.protocol);
          } catch {
            return false;
          }
        },
        defaultMessage() {
          return 'La URL de la imagen no es válida';
        },
      },
    });
  };
}
