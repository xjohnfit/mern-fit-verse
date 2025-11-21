# Mobile Image Upload Guide

## Problem
Mobile devices (iOS/Android) were getting `PARSING_ERROR` when uploading profile photos.

## Root Causes
1. **Malformed JSON** - Image data not properly encoded in JSON request
2. **Missing data URI prefix** - Sending raw base64 without `data:image/...;base64,` prefix
3. **Invalid image format** - Unsupported or corrupted image data
4. **Size limits** - Images exceeding 50MB limit

## Solutions Implemented

### Backend Changes
1. **Enhanced validation** - Validates photo data type, format, and size
2. **Auto-detection** - Automatically adds data URI prefix if missing
3. **Better error handling** - Catches JSON parsing errors with descriptive messages
4. **Format detection** - Detects JPEG, PNG, GIF, WebP from base64 signatures

### Mobile App Requirements

#### React Native Example
```javascript
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const uploadProfilePhoto = async () => {
  try {
    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8, // Compress to reduce size
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      
      // Convert to base64
      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Determine mime type
      const mimeType = asset.type === 'image' 
        ? (asset.uri.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg')
        : 'image/jpeg';

      // Create proper data URI (OPTION 1 - Recommended)
      const dataUri = `data:${mimeType};base64,${base64}`;

      // OR send just base64 (OPTION 2 - Backend will add prefix)
      // const dataUri = base64;

      // Send to API
      const response = await fetch('YOUR_API_URL/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify({
          photo: dataUri,
          // ... other profile fields
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
    }
  } catch (error) {
    console.error('Upload error:', error);
    Alert.alert('Error', error.message || 'Failed to upload photo');
  }
};
```

#### Flutter Example
```dart
import 'dart:convert';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;

Future<void> uploadProfilePhoto() async {
  final picker = ImagePicker();
  
  // Pick image
  final XFile? image = await picker.pickImage(
    source: ImageSource.gallery,
    maxWidth: 1024,
    maxHeight: 1024,
    imageQuality: 80,
  );

  if (image != null) {
    try {
      // Read image as bytes
      final bytes = await image.readAsBytes();
      
      // Convert to base64
      final base64Image = base64Encode(bytes);
      
      // Determine mime type
      final mimeType = image.path.toLowerCase().endsWith('.png') 
        ? 'image/png' 
        : 'image/jpeg';
      
      // Create data URI
      final dataUri = 'data:$mimeType;base64,$base64Image';
      
      // Send to API
      final response = await http.put(
        Uri.parse('YOUR_API_URL/api/users/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $yourAuthToken',
        },
        body: jsonEncode({
          'photo': dataUri,
          // ... other profile fields
        }),
      );

      if (response.statusCode == 200) {
        print('Upload successful');
      } else {
        throw Exception(response.body);
      }
    } catch (e) {
      print('Upload error: $e');
    }
  }
}
```

## Important Notes

### Image Size Optimization
- **Compress before upload** - Use quality: 0.7-0.8 for JPEG
- **Resize dimensions** - Max 1024x1024 or 800x800 for profile photos
- **50MB hard limit** - Server will reject larger images

### Supported Formats
- JPEG/JPG ✅
- PNG ✅
- GIF ✅
- WebP ✅
- HEIC/HEIF ✅ (iOS) - Auto-converted by Cloudinary

### Error Messages
- `Invalid photo data format` - Photo field is not a string or is empty
- `Invalid image format` - Unsupported format or malformed data URI
- `Image size exceeds 50MB limit` - Reduce quality/dimensions
- `PARSING_ERROR` - JSON parsing failed (check JSON structure)

## Testing
1. Test with small images first (< 1MB)
2. Check console logs for detailed error information
3. Verify base64 string starts with proper data URI prefix
4. Test with different image formats (JPEG, PNG, HEIC)

## Troubleshooting

### Still getting PARSING_ERROR?
1. **Check JSON structure** - Ensure valid JSON with properly escaped strings
2. **Use Content-Type: application/json** - Required header
3. **Log the request** - Print request body size and first 100 chars
4. **Test with Postman** - Verify API works with manual request

### Image not uploading?
1. **Check file size** - Must be under 50MB
2. **Verify base64 encoding** - Should not have newlines or spaces
3. **Test internet connection** - Large uploads need stable connection
4. **Check auth token** - Ensure valid authentication

## Contact
If issues persist, check backend logs for detailed error messages.
