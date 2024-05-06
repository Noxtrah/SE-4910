package se4910.recipiebeckend.config;

import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.common.StorageSharedKeyCredential;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.multipart.support.MultipartFilter;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

@Configuration
public class AzureStorageConfig {

    @Value("${azure.storage.account-url}")
    private String accountUrl;

    @Value("${azure.storage.sas-token}")
    private String sasToken;

    @Value("${azure.storage.account-key}")
    private String accountKey;

    @Bean
    public BlobServiceClient blobServiceClient() {
        return new BlobServiceClientBuilder()
                .endpoint(accountUrl)
                .sasToken(sasToken)
                .credential(StorageSharedKeyCredential.fromConnectionString(accountKey))
                .buildClient();
    }

  /*  @Bean(name = "multipartResolver")
    public StandardServletMultipartResolver resolver() {
        return new StandardServletMultipartResolver();
    }

    @Bean
    public FilterRegistrationBean<MultipartFilter> multipartFilterRegistrationBean() {
        FilterRegistrationBean<MultipartFilter> filterRegistrationBean = new FilterRegistrationBean<>();
        filterRegistrationBean.setFilter(new MultipartFilter());
        filterRegistrationBean.addUrlPatterns("/*");
        filterRegistrationBean.setName("multipartFilter");
        filterRegistrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return filterRegistrationBean;
    }*/
}
