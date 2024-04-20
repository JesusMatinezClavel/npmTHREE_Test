import { useEffect, useState } from 'react'
import './three.css'

import { CInput } from "../../common/c-input/cInput";

import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'







import WebGL from 'three/addons/capabilities/WebGL.js';


export const Three = () => {

    const loader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();
    const reader = new FileReader()

    //3D
    const renderer3D = new THREE.WebGLRenderer()
    const scene3D = new THREE.Scene()
    const camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
    const geometry3D = new THREE.BoxGeometry(1, 1, 1)
    const material3D = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const light = new THREE.PointLight(0xffffff, 10000)
    const ambientLight = new THREE.AmbientLight()
    const controls = new OrbitControls(camera3D, renderer3D.domElement)


    // const cube = new THREE.Mesh(geometry3D, material3D)


    //DRAWING
    // const [rendererDrawing] = useState(new THREE.WebGLRenderer());
    // const [sceneDrawing] = useState(new THREE.Scene())
    // const [cameraDrawing] = useState(new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500))
    // const [points] = useState([new THREE.Vector3(-10, 0, 0), new THREE.Vector3(0, 10, 0), new THREE.Vector3(10, 0, 0), new THREE.Vector3(0, -10, 0), new THREE.Vector3(-10, 0, 0)]);
    // const [materialDrawing] = useState(new THREE.LineBasicMaterial({ color: 0x0090ff }))
    // const [geometryDrawing] = useState(new THREE.BufferGeometry().setFromPoints(points))
    // const [line] = useState(new THREE.Line(geometryDrawing, materialDrawing))

    // const [asset,setAsset]

    const [asset, setAsset] = useState('../../dist/client/models/brick.fbx')
    const [texture, setTexture] = useState(null)
    const [object, setObject] = useState(null)

    const inputHandlerModel = (e) => {
        const file = e.target.files[0];
        setAsset(URL.createObjectURL(file));
    }
    
    const inputHandlerMaterial = (e) => {
        const file = e.target.files[0]
        const texture = textureLoader.load(URL.createObjectURL(file))
        setTexture(texture)
    }


    useEffect(() => {
        if (!WebGL.isWebGLAvailable()) {
            const warning = WebGL.getWebGLErrorMessage();
            document.getElementById('container').appendChild(warning);
            return;
        }
        scene3D.add(new THREE.AxesHelper(.4))
        scene3D.add(light)
        scene3D.add(ambientLight)

        renderer3D.setSize(window.innerWidth / 4, window.innerHeight / 4)
        renderer3D.domElement.classList.add('viewport')
        document.getElementsByClassName('viewport3D')[0].appendChild(renderer3D.domElement)

        window.addEventListener('resize', onWindowResize, false)
        function onWindowResize() {
            camera3D.aspect = window.innerWidth / window.innerHeight
            camera3D.updateProjectionMatrix()
            renderer3D.setSize(window.innerWidth / 4, window.innerHeight / 4)
            render()
        }

        const render = () => {
            renderer3D.render(scene3D, camera3D)
        }

        controls.enableDamping = true
        controls.target.set(0, 0, 0)

        // 3D VIEWPORT

        '../../dist/client/models/brick.fbx'
        loader.load((asset),
            (object) => {
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material = texture || child.material
                        if (child.material) {
                            child.material.transparent = false
                        }
                    }
                })
                scene3D.add(object)
                setObject(object)

                const bbox = new THREE.Box3().setFromObject(object);
                const objectSize = new THREE.Vector3();
                bbox.getSize(objectSize);
                console.log(objectSize);

                const maxObjectSize = (objectSize.x, objectSize.y, objectSize.z)
                const cameraDistance = maxObjectSize * 1.5

                camera3D.position.set(20, 20, cameraDistance)
                light.position.set(20, 50, cameraDistance)

                const objectCenter = bbox.getCenter(new THREE.Vector3());
                camera3D.lookAt(objectCenter);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )

        const animate = () => {
            requestAnimationFrame(animate);

            controls.update()

            render()

        }

        animate();

        // DRAWING VIEWPORT

        // rendererDrawing.setSize(window.innerWidth / 2, window.innerHeight / 2)
        // rendererDrawing.domElement.classList.add('viewport')
        // document.getElementsByClassName('viewportDrawing')[0].appendChild(rendererDrawing.domElement)

        // cameraDrawing.position.set(0, 0, 100)
        // cameraDrawing.lookAt(0, 0, 0)

        // sceneDrawing.add(line)
        // rendererDrawing.render(sceneDrawing, cameraDrawing)

        return () => {
            window.removeEventListener('resize', onWindowResize);
        };
    }, [asset, texture]);


    return (
        <>
            <div className="three-design">
                <div className='viewport3D'>
                    <CInput
                        type={'file'}
                        onChange={(e) => inputHandlerModel(e)}
                    />
                    <CInput
                        type={'file'}
                        onChange={(e) => inputHandlerMaterial(e)}
                    />
                </div>
                {/* <div className='viewportDrawing'></div> */}
            </div>
        </>
    )
}