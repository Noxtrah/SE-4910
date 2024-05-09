package se4910.recipiebeckend.config;

import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.common.StorageSharedKeyCredential;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class AzureStorageConfig {


    @Bean
    public BlobServiceClient blobServiceClient() {
        return new BlobServiceClientBuilder()
                .endpoint(accountUrl)
                .sasToken(sasToken)
                .credential(StorageSharedKeyCredential.fromConnectionString(accountKey))
                .buildClient();
    }


}
