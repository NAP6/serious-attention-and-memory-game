import fs from 'fs';
/**
 * This Class is used to save the a base64 image in the server.
 */
class save_image {
    static decodeBase64(imageBase64) {
        var matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};

        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }

        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');

        return response;
    }

    static save(path, image) {
        fs.writeFileSync(path, image);
       }
}

export { save_image };