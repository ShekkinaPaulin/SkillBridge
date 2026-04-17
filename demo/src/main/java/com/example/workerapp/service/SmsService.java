package com.example.workerapp.service;




import com.twilio.Twilio;
import com.twilio.http.NetworkHttpClient;
import com.twilio.http.TwilioRestClient;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContextBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

@Service
public class SmsService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromNumber;

    @PostConstruct
    public void init() {
        try {
            // ✅ use HttpClientBuilder instead of CloseableHttpClient
            HttpClientBuilder httpClientBuilder = HttpClients.custom()
                    .setSSLSocketFactory(new SSLConnectionSocketFactory(
                            SSLContextBuilder.create()
                                    .loadTrustMaterial(null, (chain, authType) -> true)
                                    .build(),
                            NoopHostnameVerifier.INSTANCE
                    ));

            NetworkHttpClient networkHttpClient = new NetworkHttpClient(httpClientBuilder);

            Twilio.init(accountSid, authToken);
            Twilio.setRestClient(
                    new TwilioRestClient.Builder(accountSid, authToken)
                            .httpClient(networkHttpClient)
                            .build()
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendSms(String toPhone, String workerName,
                        String seekerName, String seekerPhone, String messageText) {

        String body = "Hi " + workerName + "! You have a new job request.\n"
                + "From: " + seekerName + "\n"
                + "Phone: " + seekerPhone + "\n"
                + "Message: " + messageText;

        Message.creator(
                new PhoneNumber("+91" + toPhone),
                new PhoneNumber(fromNumber),
                body
        ).create();
    }
}