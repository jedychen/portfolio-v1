render: function() {
        if (this.AUTO_FLIP === true) {
            this.renderer.render(this.scene, this.camera);
            return;
        }
        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects( this.group.children );
        if ( intersects.length > 0 ) {
            if ( this.INTERSECTED != intersects[ 0 ].object ) {
                this.INTERSECTED = intersects[ 0 ].object
                if ( this.INTERSECTED.name == 'card' ) {
                    this.INTERSECTED.flip.restart()
                    document.documentElement.style.cursor = 'pointer';
                }
            }
            else if ( this.INTERSECTED && this.INTERSECTED.name == 'card') {
                document.documentElement.style.cursor = 'pointer';
                if ( this.INTERSECTED.flip.progress() >= 0.5 ) {
                    this.INTERSECTED.flip.progress(0.5)
                }
            }
        } else {
            document.documentElement.style.cursor = 'default';
        }
        this.renderer.render(this.scene, this.camera)
    },
    loadCoverImages: function() {
        let imageLoader = new THREE.TextureLoader();
        this.coverImages = []

        const imageOffsets = [
            {x: 0., y: 0.5 },
            {x: 0.333, y: 0.5 },
            {x: 0.666, y: 0.5},
            {x: 0., y: 0. },
            {x: 0.333, y: 0. },
            {x: 0.666, y: 0. },
        ]

        for (let i=0; i < this.PROJ_NUM; i++) {
            for (let j=0; j<6; j++) {
                let coverImage = require('../assets/' + this.projectsConfig.projects[i].imageUrl );
                let coverImageTexture = imageLoader.load(coverImage);
                coverImageTexture.repeat.set( 0.333, 0.5 );
                coverImageTexture.offset.set( imageOffsets[j].x, imageOffsets[j].y );
                this.coverImages.push(coverImageTexture)
            }
        }
    },
    setupResponsive: function(resize=false) {
        this.renderer.setSize(this.container.innerWidth, this.container.innerHeight);
        let width = this.container.innerWidth;
        let aspectRatio = this.container.innerWidth / this.container.innerHeight;
        this.CAMERA_Z = this.cameraDistance / aspectRatio;
        // Move the camera to the top of project cards
        let CAMERA_Y = Math.floor(this.PROJ_NUM / this.PROJ_COL_NUM / 2) * this.CARD_ROW_NUM * this.CARD_SIZE;
        this.setupCamera(0, CAMERA_Y, this.CAMERA_Z);
        this.camera.aspect = aspectRatio;
        this.camera.updateProjectionMatrix();

        if (!this.CARD_CREATED)
            this.setupProjectCards(this.group, this.projectsConfig);
        else
            this.resetProjectCards(resize);
    },
    setupCamera: function(x, y, z) {
        this.camera.position.set(x, y, z);
    },
    setupLights: function(parent) {
        let key_light = new THREE.DirectionalLight(this.LIGHT_COLOR, 1.5);
        let ambient_light = new THREE.AmbientLight(this.LIGHT_COLOR, 1.2);
        key_light.position.set(-this.WALL_SIZE, this.WALL_SIZE, this.WALL_SIZE);
        ambient_light.position.set(this.WALL_SIZE, this.WALL_SIZE, this.WALL_SIZE);
        parent.add(key_light).add(ambient_light);
    },
    setupRenderer: function(parent) {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(this.BACKGROUND_COLOR, 1.0);
        parent.appendChild(this.renderer.domElement);
    },
    setupProjectCards: function(parent, projectsConfig) {
        let geometry = new THREE.BoxBufferGeometry(this.CARD_SIZE, this.CARD_SIZE, 0.03);
        const blankMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
        for (let i=0; i < this.PROJ_NUM; i++) {
            this.setupCardsSingleProject(parent, projectsConfig.projects[i], blankMaterial, geometry)
        }
    },
    setupCardsSingleProject: function(parent, projectConfig, material, geometry) {
        let projectIndex = projectConfig.position;
        let projectOrigin = this.calcuProjOriginPos(projectIndex);
        
        for (let i = 0; i < 6; i++) {
            let horizontalFlip = Math.random() >= 0.5;
            let index = i + projectIndex*6;
            let cardMaterial = [
                material, //left
                material, //right
                material, // top
                material, // bottom
                material,
                material,
            ];

            let card = new THREE.Mesh(geometry, cardMaterial );
            card.name = 'card';
            card.index = i; // index between 0 to 6
            card.projectIndex = projectIndex;
            card.rotateDir = (Math.random() < 0.5 ? -Math.PI : Math.PI);
            card.rotateAxis = horizontalFlip ? 'y' : 'x';

            this.setProjectCard(card, projectOrigin, projectIndex, i);

            this.cards.push(card);
            parent.add(card);
        }

        this.CARD_CREATED = true;
    },
    resetProjectCards: function(resize=false){
        for (let i=0; i<this.cards.length; i++) {
            let card = this.cards[i];
            let projectIndex = card.projectIndex;
            let projectOrigin = this.calcuProjOriginPos(projectIndex);

            this.setProjectCard(card, projectOrigin, projectIndex, card.index, resize);
        }
    },
    setProjectCard: function (card, projectOrigin, projectIndex, cardIndex, resize) {
        let x = projectOrigin.x + (cardIndex % this.CARD_COL_NUM) * this.CARD_SIZE;
        let y = projectOrigin.y - Math.floor(cardIndex / this.CARD_COL_NUM) * this.CARD_SIZE;
        card.position.set(x, y, 0);
        // Gives each card a relative position of index (x, y) within the canvas, 
        // card at the top left corner is (0, 0), the card on the right is (1, 0)
        let projOriginPos = {
            x: (projectIndex % this.PROJ_COL_NUM) * this.CARD_COL_NUM,
            y: Math.floor(projectIndex / this.PROJ_COL_NUM) * this.CARD_ROW_NUM
        };
        card.coordinatePos = {
            x: projOriginPos.x + cardIndex % this.CARD_COL_NUM,
            y: projOriginPos.y + Math.floor(cardIndex / this.CARD_COL_NUM)
        };
        if (!resize) this.addCardFlipAnimation(card, resize);
    },
    calcuProjOriginPos: function (projectIndex) {
        let projectWidth = this.CARD_COL_NUM * this.CARD_SIZE;
        let projectHeight = this.CARD_ROW_NUM * this.CARD_SIZE;
        let overallWidth = this.PROJ_COL_NUM * this.projectWidth;
        let overallHeight = Math.floor(this.PROJ_NUM/this.PROJ_COL_NUM) * projectHeight;

        let xOrigin =  - overallWidth / 2 + (projectIndex % this.PROJ_COL_NUM) * projectWidth;
        let yOrigin = overallHeight * 0.5 - Math.floor(projectIndex / this.PROJ_COL_NUM) * projectHeight;

        return {x: xOrigin + this.CARD_SIZE * 0.5, y: yOrigin + this.CARD_SIZE * 0.5};
    },
    /* -- Draws text on a canvas --*/
    // To be used as texture on cards.
    //  textArray: string Separated with ','.
    //  color: hex number.
    //  fontWeight: string 'normal'/'bold'/'lighter'
    //  horizontalFlip: boolean If the card is flipping horizontally. 
    drawTextAsTexture: function (textArray, color, fontWeight, horizontalFlip) {
        let canvas = document.createElement("canvas");
        const canvasSize = 256;
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        let context = canvas.getContext("2d");
        context.font = fontWeight + " 26pt Helvetica"
        context.textAlign = "left";
        context.fillStyle = color;

        // Rotates canvas if the card is not flipping horizontally.
        let flip = 1;
        if (!horizontalFlip) {
            context.rotate(Math.PI);
            flip = -1;
        }
        // Draw canvas background
        context.fillRect(0,0,flip * canvas.width,flip * canvas.height);
        // Draw texts
        let x = flip * canvas.width / 2 - 110;
        let y = flip * canvas.height / 2 - 70;
        context.fillStyle = "black";
        for (let i=0; i<textArray.length; i++) {
            context.fillText(textArray[i], x, y);
            y += 50;
        }

        let texture = new THREE.Texture( canvas );
        texture.needsUpdate = true;
        return texture
    },
    /* -- Adds flipping animation as GSAP timeline --*/
    //  card: object3D Project card
    addCardFlipAnimation: function (card) {
        const duration = 2; // 2 seconds
        let delay = 0;
        let pause = true;
        let repeat = 0;
        if (this.AUTO_FLIP) {
            delay = this.randomInRange(0, 40);
            pause = false;
            repeat = -1;
        }
        let config_flip = {
            ease : Elastic.easeOut,
            duration: duration,
            delay: delay,
        };
        let config_reverse = {
            ease : Elastic.easeOut,
            duration: duration,
        };

        config_flip[card.rotateAxis] = card.rotateDir;
        config_reverse[card.rotateAxis] = 0;

        card.flip = gsap.timeline({
            paused: pause,
            repeat: repeat
        }).to(
            card.rotation,
            config_flip
        ).to(
            card.rotation,
            config_reverse
        );
    },
    /* -- Calculate distance between two Vec2 points -- */
    //  pos1: vec2
    //  pos2: vec2
    calcDistance: function (pos1, pos2) {
        let a = pos1.x - pos2.x
        let b = pos1.y - pos2.y
        return Math.sqrt( a*a + b*b );
    },
    randomInRange: function (min, max) {
        return Math.random() * (max- min + 1) + min;
    },