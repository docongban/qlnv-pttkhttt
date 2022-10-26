package com.laos.edu.soapws;

import com.laos.edu.commons.Translator;
import com.laos.edu.service.dto.SmsDTO;
import lombok.Getter;
import lombok.Setter;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.CookieStore;
import org.apache.http.client.HttpRequestRetryHandler;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContexts;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.net.ssl.SSLContext;
import java.io.IOException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.security.KeyStore;

@Service
public class SmsHandler {
    private WsRequestCreator wsConfig;
    static PoolingHttpClientConnectionManager connManager;

    @Value("${sms.wsAddress}")
    private String wsAddress;
    @Value("${sms.timeout}")
    private int timeout;
    @Value("${sms.receiveTimeout}")
    private int receiveTimeout;
    @Value("${sms.username}")
    private String username;
    @Value("${sms.password}")
    private String password;
    @Value("${sms.brandname}")
    private String brandname;

    //send OTP
    @Value("${otp.wsAddress}")
    private String wsAddressOtp;
    @Value("${otp.timeout}")
    private int timeoutOtp;
    @Value("${otp.receiveTimeout}")
    private int receiveTimeoutOtp;
    @Value("${otp.username}")
    private String usernameOtp;
    @Value("${otp.password}")
    private String passwordOtp;
    @Value("${otp.brandname}")
    private String brandnameOtp;

    private final Logger log = LoggerFactory.getLogger(SmsHandler.class);

    public SmsHandler() {
    }

    synchronized static PoolingHttpClientConnectionManager getconnManager() {
        if (connManager != null)
            return connManager;
        KeyStore trustStore = null;
        try {
            trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
            trustStore.load(null, null);
        } catch (Exception e) {
        }
        SSLContext sslcontext = null;
        try {
            sslcontext = SSLContexts.custom()
                .loadTrustMaterial(trustStore, new TrustSelfSignedStrategy())
                .build();
        } catch (Exception e) {
        }
        SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslcontext, SSLConnectionSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
        Registry<ConnectionSocketFactory> socketFactoryRegistry = RegistryBuilder.<ConnectionSocketFactory>create()
            .register("http", PlainConnectionSocketFactory.INSTANCE)
            .register("https", sslsf)
            .build();

        connManager = new PoolingHttpClientConnectionManager(socketFactoryRegistry);
        return connManager;
    }

    public ImportSMSResponse sendSms(SmsDTO smsDTO) {
        wsConfig = new WsRequestCreator();
        wsConfig.setWsAddress(wsAddress);
        wsConfig.setConnectionTimeout(timeout);
        wsConfig.setReceiveTimeout(receiveTimeout);
        wsConfig.setBrandname(brandname);
        wsConfig.setPassword(password);
        wsConfig.setUsername(username);
        wsConfig.setMaxRetry(3);
        String request = sendMessageSoap(smsDTO,wsConfig);
        try {
            String reponse = execute(request, wsConfig);
            ImportSMSResponse result = convertXmlSoapToObject(reponse);
            return result;
        } catch (Exception ex) {
            log.error(ex.getMessage(),ex);
        }
        return null;
    }

    public ImportSMSResponse sendOtp(SmsDTO smsDTO) throws Exception {
        wsConfig = new WsRequestCreator();
        wsConfig.setWsAddress(wsAddressOtp);
        wsConfig.setConnectionTimeout(timeoutOtp);
        wsConfig.setReceiveTimeout(receiveTimeoutOtp);
        wsConfig.setBrandname(brandnameOtp);
        wsConfig.setPassword(passwordOtp);
        wsConfig.setUsername(usernameOtp);
        wsConfig.setMaxRetry(3);
        String request = sendMessageSoap(smsDTO, wsConfig);
        try {
            String reponse = execute(request, wsConfig);
            ImportSMSResponse result = convertXmlSoapToObject(reponse);
            return result;
        } catch (Exception ex) {
            throw new Exception(Translator.toLocale("failure.system.sms"));
        }
    }

    private ImportSMSResponse convertXmlSoapToObject(String outputStr) {
        ImportSMSResponse result = null;
        try {
            result = new ImportSMSResponse();
            String errorCode = getValueByTag("<error_code xsi:type=\"xsd:int\">","</error_code>",outputStr);
            String descr = getValueByTag("<descr xsi:type=\"xsd:string\">","</descr>",outputStr);
            result.setDescr(descr);
            result.setErrorCode(errorCode);
            return result;
        } catch (Exception ex) {
            log.error(ex.getMessage(),ex);
        }
        return null;
    }


    public static String sendMessageSoap(SmsDTO input,final WsRequestCreator wsConfig) {
        String request = "<soapenv:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"> " +
            "   <soapenv:Header/> " +
            "   <soapenv:Body> " +
            "      <importSMS soapenv:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"> " +
            "         <username xsi:type=\"xsd:string\">" + wsConfig.getUsername() + "</username> " +
            "         <password xsi:type=\"xsd:string\">" + wsConfig.getPassword() + "</password> " +
            "         <brand_name xsi:type=\"xsd:string\">" + wsConfig.getBrandname() + "</brand_name> " +
            "         <phone_numbers xsi:type=\"xsd:string\">" + input.getPhoneNumber() + "</phone_numbers> " +
            "         <language_id xsi:type=\"xsd:int\">" + input.getLanguageId() + "</language_id> " +
            "         <content xsi:type=\"xsd:string\">" + input.getContent() + "</content> " +
            "      </importSMS> " +
            "   </soapenv:Body> " +
            "</soapenv:Envelope> ";
        return request;
    }


    public static String execute(String requestTxt, final WsRequestCreator wsConfig) throws Exception {
        try {
            String urlAddress = wsConfig.getWsAddress();

            URL aURL = new URL(urlAddress);
            int timeout = (wsConfig.getConnectionTimeout() == 0) ? 20000 : wsConfig.getConnectionTimeout();
            int receiveTimeout = (wsConfig.getReceiveTimeout() == 0) ? 20000 : wsConfig.getReceiveTimeout();

            CloseableHttpClient httpClient = null;
            HttpResponse httpResponse = null;
            HttpPost httpPost = null;

            try {
                // Create global request configuration
                RequestConfig defaultRequestConfig = RequestConfig.custom()
                    .setConnectTimeout(timeout)
                    .setSocketTimeout(receiveTimeout)
                    .build();

                HttpRequestRetryHandler retryHandler = new HttpRequestRetryHandler() {

                    @Override
                    public boolean retryRequest(IOException exception, int executionCount, org.apache.http.protocol.HttpContext hc) {
                        if (executionCount > wsConfig.getMaxRetry()) {
                            return false;
                        }
                        if (exception instanceof org.apache.http.NoHttpResponseException) {
                            return true;
                        }
                        return false;
                    }
                };

                PoolingHttpClientConnectionManager connManager = getconnManager();
                CookieStore cookieStore = new BasicCookieStore();

                httpClient = HttpClients.custom()
                    .setConnectionManager(connManager)
                    .setDefaultCookieStore(cookieStore)
                    .setDefaultCredentialsProvider(null)
                    .setDefaultRequestConfig(defaultRequestConfig)
                    .setRetryHandler(retryHandler)
                    .build();

                httpPost = new HttpPost(urlAddress);
                StringEntity reqEntity = new StringEntity(requestTxt, ContentType.create(ContentType.TEXT_XML.getMimeType(), "utf-8"));
                httpPost.setEntity(reqEntity);
                // end
                httpResponse = httpClient.execute(httpPost);

                int statusCode = httpResponse.getStatusLine().getStatusCode();
                String response = EntityUtils.toString(httpResponse.getEntity());

                if (statusCode != 200) {
                    throw new Exception(response);
                }
                return response;
            } catch (Exception e) {
                throw e;
            } finally {
                if (httpResponse != null) {
                    HttpEntity entity = httpResponse.getEntity();
                    if (entity != null) {
                        entity.getContent().close();
                    }
                }
            }
        } catch (SocketTimeoutException ex) {
            throw new SocketTimeoutException(ex.getMessage());

        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }

    }

    private static String getValueByTag(String openTag, String closeTag, String response) {
        if (response.contains(openTag)) {
            int start = response.indexOf(openTag) + openTag.length();
            int end = response.lastIndexOf(closeTag);
            return response.substring(start, end);
        }
        return null;
    }
}
