// backend\sge-app\src\main\java\com\sge\sge_app\exception\ResourceNotFoundException.java
package com.sge.sge_app.exception;


public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}