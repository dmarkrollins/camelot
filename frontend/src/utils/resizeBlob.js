const calcRatio = (imageWidth, imageHeight) => {
    var boundBoxSize = 100;
    var ret = {};
    let ratio
    if (imageWidth > imageHeight) {
        ratio = imageHeight / imageWidth;
        ret['height'] = boundBoxSize * ratio;
        ret['width'] = boundBoxSize;
    } else if (imageWidth < imageHeight) {
        ratio = imageWidth / imageHeight;
        ret['height'] = boundBoxSize;
        ret['width'] = boundBoxSize * ratio;
    } else {
        ret['height'] = boundBoxSize;
        ret['width'] = boundBoxSize;
    }
    return ret
}

const ResizeBlob = async (drawing) => {

    const img = await createImageBitmap(drawing)

    const hw = calcRatio(img.width, img.height)

    return new Promise((res) => {
        let canvas = document.createElement('canvas')
        canvas.width = hw.width
        canvas.height = hw.height
        let ctx = canvas.getContext('bitmaprenderer')
        ctx.transferFromImageBitmap(img)
        const newBlob = canvas.toBlob(res)
        canvas = null
        return newBlob
    })
}

export default ResizeBlob