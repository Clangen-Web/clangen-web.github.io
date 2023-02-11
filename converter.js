
var csvFormat = [
    'ID',
    'name',
    'gender',
    'status',
    'age',
    'trait',
    'parent1',
    'parent2',
    'mentor',
    'pelt_name',
    'pelt_color',
    'pelt_white',
    'pelt_length',
    'spirit_kitten',
    'spirit_adolescent',
    'spirit_adult',
    'spirit_elder',
    'eye_colour',
    'reverse',
    'white_patches',
    'pattern',
    'skin',
    'skill',
    'NULL',
    'specialty',
    'moons',
    'mate',
    'dead',
    'spirit_dead',
    'specialty2',
    'experience',
    'dead_moons',
    'current_apprentice',
    'former_apprentices',
];

const id_fields = [
    'parent1',
    'parent2',
    'ID',
    'mate',
    'mentor'
]

const tortie_map = {
    'ONE': {
        'tortie_base': 'single',
        'tortie_color': 'BLACK',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDONE'
    },
    'TWO': {
        'tortie_base': 'single',
        'tortie_color': 'BLACK',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDTWO'
    },
    'FADEDONE': {
        'tortie_base': 'single',
        'tortie_color': 'BROWN',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDONE'
    },
    'FADEDTWO': {
        'tortie_base': 'single',
        'tortie_color': 'BROWN',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDTWO'
    },
    'BLUEONE': {
        'tortie_base': 'single',
        'tortie_color': 'SILVER',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'PALEONE'
    },
    'BLUETWO': {
        'tortie_base': 'single',
        'tortie_color': 'SILVER',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'PALETWO'
    }
}

const calico_map = {
    'ONE': {
        'tortie_base': 'single',
        'tortie_color': 'BLACK',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDTHREE'
    },
    'TWO': {
        'tortie_base': 'single',
        'tortie_color': 'BLACK',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDFOUR'
    },
    'THREE': {
        'tortie_base': 'single',
        'tortie_color': 'BLACK',
        'tortie_pattern': 'tortietabby',
        'pattern': 'GOLDTHREE'
    },
    'FOUR': {
        'tortie_base': 'single',
        'tortie_color': 'BLACK',
        'tortie_pattern': 'tortietabby',
        'pattern': 'GOLDFOUR'
    },
    'FADEDONE': {
        'tortie_base': 'single',
        'tortie_color': 'BROWN',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDTHREE'
    },
    'FADEDTWO': {
        'tortie_base': 'single',
        'tortie_color': 'BROWN',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDFOUR'
    },
    'FADEDTHREE': {
        'tortie_base': 'tabby',
        'tortie_color': 'BROWN',
        'tortie_pattern': 'tortietabby',
        'pattern': 'GOLDTHREE'
    },
    'FADEDFOUR': {
        'tortie_base': 'tabby',
        'tortie_color': 'BROWN',
        'tortie_pattern': 'tortietabby',
        'pattern': 'GOLDFOUR'
    },
    'BLUEONE': {
        'tortie_base': 'single',
        'tortie_color': 'SILVER',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'PALETHREE'
    },
    'BLUETWO': {
        'tortie_base': 'single',
        'tortie_color': 'SILVER',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'PALEFOUR'
    },
    'BLUETHREE': {
        'tortie_base': 'tabby',
        'tortie_color': 'SILVER',
        'tortie_pattern': 'tortietabby',
        'pattern': 'PALETHREE'
    },
    'BLUEFOUR': {
        'tortie_base': 'tabby',
        'tortie_color': 'SILVER',
        'tortie_pattern': 'tortietabby',
        'pattern': 'PALEFOUR'
    }
}
const convertbutton = document.getElementById('convertbutton');
function readCsvSave(csvTxt) {
    
    var catData = [];
    var rows = csvTxt.split('\n');
    var wrongColumnAmount = false;

    rows.forEach(row => {
        // skip empty rows
        if (row == null || row.trim() === ''){
            return;
        }
        var columns = row.split(',');
        var cat = {}
        if (columns.length != csvFormat.length) {
            wrongColumnAmount = true;
        }
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            column = column.trim();
            if (column == 'None') {
                column = null;
            } else if ('true'.localeCompare(column, undefined, { sensitivity: 'accent' }) === 0) {
                column = true;
            } else if ('false'.localeCompare(column, undefined, { sensitivity: 'accent' }) === 0) {
                column = false;
            } else if (!isNaN(column)) {
                column = Number(column);
            }
            cat[csvFormat[i]] = column;
        }

        cat.current_apprentice = cat.current_apprentice === null ? []: cat.current_apprentice.toString().split(';');
        cat.former_apprentices = cat.former_apprentices === null ? []: cat.former_apprentices.toString().split(';');
        catData.push(cat);
    });
    if (wrongColumnAmount == true) {
        alert('WARNING: File does not seem to be in the Clangen Aug 10 save format. Conversion may not work.')
    }
    return catData;
}

function addMissingData(catData) {
    catData.forEach(cat => {
        var split_name = cat.name.split(':');
        cat.name_prefix = split_name[0];
        cat.name_suffix = split_name[1] === '' ? null: split_name[1];

        delete cat.name;
        delete cat.NULL;

        id_fields.forEach(id_field => {
            if (cat[id_field] !== null) {
                cat[id_field] = cat[id_field].toString();
            }
        });

        cat.gender_align = cat.gender;
        cat.paralyzed = false;
        cat.no_kits = false;
        cat.exiled = false;

        if (cat.pelt_name === 'Tortie') {
            var tortie_vars = tortie_map[cat.pattern];
        } else if (cat.pelt_name === 'Calico') {
            var tortie_vars = calico_map[cat.pattern];
        } else {
            var tortie_vars = {
                'tortie_base': null,
                'tortie_color': null,
                'tortie_pattern': null,
            }
        }
        cat = Object.assign(cat, tortie_vars);

        cat.spirit_young_adult = cat.spirit_adult;
        cat.spirit_senior_adult = cat.spirit_adult;
        cat.accessory = null;

    });
    return catData;
}

function save(filename, data) {
    const elem = window.document.createElement('a');
    const blob = new Blob([data], {type: 'application/json'});
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
}

function onClick() {
    const clans = window.localStorage.getItem('clanlist.txt').replace(/^\s+|\s+$/g, '').split('\n');
    console.log(clans);

    clans.forEach(element => {
        var data = window.localStorage.getItem(element + 'cats.csv');
        window.localStorage.setItem(element + 'cats.csv.backup', data);
        var newdata = readCsvSave(data);
        newdata = addMissingData(newdata);
        window.localStorage.setItem(element + '/clan_cats.json', JSON.stringify(newdata));
        window.localStorage.removeItem(element + 'cats.csv');
    });
    /*const file = window.localStorage.getItem('Duckcats.csv');
        try {
            var catData = readCsvSave(file);
            catData = addMissingData(catData);
        } catch(err) {
            console.error(err.message)
            alert('ERROR: Save conversion failed.');
        }
        window.localStorage.setItem('Duckcats.json', JSON.stringify(catData, null, 0));
    */
}
convertbutton.addEventListener('click', onClick, false);
