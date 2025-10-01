// backend\sge-app\src\main\java\com\sge\sge_app\exception\BusinessException.java
package com.sge.sge_app.exception;

public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}