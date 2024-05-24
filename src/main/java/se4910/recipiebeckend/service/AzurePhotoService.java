package se4910.recipiebeckend.service;

import com.azure.storage.blob.BlobServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;
import java.util.UUID;


@Service

public class AzurePhotoService {


    @Autowired
    private BlobServiceClient blobServiceClient;
    public String uploadPhotoToBlobStorage(MultipartFile photo) {

        if (photo == null || photo.isEmpty()) {
            throw new IllegalArgumentException("Photo is null or empty");
        }


        String containerName = "recipeimages";
        String fileExtension = getFileExtension(Objects.requireNonNull(photo.getOriginalFilename()));
        String fileName = generateUniqueFileName(fileExtension);
        try {
            blobServiceClient.getBlobContainerClient(containerName)
                    .getBlobClient(fileName)
                    .upload(photo.getInputStream(), photo.getSize());
            return blobServiceClient.getBlobContainerClient(containerName).getBlobClient(fileName).getBlobUrl();
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload photo to Blob Storage", e);
        }
    }

    public String generateUniqueFileName(String fileExtension) {
        return UUID.randomUUID().toString() + "." + fileExtension;
    }

    public String getFileExtension(String filename) {
        int lastIndexOf = filename.lastIndexOf(".");
        if (lastIndexOf == -1 || lastIndexOf == filename.length() - 1) {
            throw new IllegalArgumentException("Invalid filename: " + filename);
        }
        return filename.substring(lastIndexOf + 1);
    }
}
