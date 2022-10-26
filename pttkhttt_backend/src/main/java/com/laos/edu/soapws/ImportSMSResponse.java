
package com.laos.edu.soapws;

import java.io.Serializable;

public class ImportSMSResponse implements Serializable {
    private String errorCode;
    private String  descr;

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getDescr() {
        return descr;
    }

    public void setDescr(String descr) {
        this.descr = descr;
    }
}


