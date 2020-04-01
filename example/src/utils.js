import _ from "lodash";

export const possibleOutputs = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Duis non nulla rhoncus, suscipit dolor nec, vehicula leo.
    Curabitur ac metus eu nisl venenatis dapibus.
    Fusce ornare erat ut urna laoreet, non venenatis enim varius.
    Maecenas quis lacus finibus, dictum neque ac, pretium mi.
    Aliquam pretium lorem ac nulla tincidunt laoreet.
    Quisque feugiat urna eget facilisis mollis.
    Cras imperdiet libero vitae elementum tristique.
    In vestibulum purus a risus sollicitudin bibendum.
    Praesent non purus varius, venenatis ante eget, imperdiet nisl.
    Mauris ut dui tempus, suscipit neque sed, tempor libero.
    Praesent eget nisi sed nunc porta egestas.
    Suspendisse eget nunc et mi hendrerit tincidunt.
    Vestibulum nec velit molestie, lacinia sapien sit amet, porta dolor.
    Vivamus ac lectus suscipit, blandit augue eu, tempor dui.
    Duis varius justo at euismod ultricies.
    In sit amet lectus dignissim, tempus velit quis, posuere arcu.
    Nunc vel erat et enim consequat pretium sed eget ex.
    Integer cursus dui at nunc faucibus mattis.
    Integer tempor urna ut malesuada pellentesque.
    Donec consectetur ligula quis urna auctor eleifend.
    Phasellus id diam et nunc lacinia vulputate vitae ac erat.
    Curabitur cursus neque eget purus iaculis, eu blandit dui commodo.
    Sed vel quam vitae urna ornare gravida.
    Phasellus feugiat ex sit amet urna viverra porttitor et id ligula.
    Nullam pretium odio vitae nibh semper tincidunt.
    Aenean in nunc semper, congue nibh interdum, gravida neque.
    Cras tincidunt nibh id dictum vehicula.
    Phasellus suscipit tellus ut ex malesuada, aliquet aliquet massa lobortis.
    Integer porttitor erat eget ante mollis accumsan.
    Morbi id arcu vel dui fringilla accumsan.
    Donec vel nulla a lacus convallis interdum.
    Curabitur consectetur turpis at leo egestas iaculis.
    Maecenas vitae mauris egestas, imperdiet turpis at, convallis mauris.
    Vestibulum blandit felis placerat urna tincidunt, eu vestibulum quam pulvinar.
    Duis hendrerit nulla vitae nulla egestas, eu hendrerit sapien consequat.
    Duis facilisis nibh a sodales hendrerit.
    Fusce aliquam erat ac blandit commodo.
    Pellentesque elementum nunc id odio fermentum cursus.
    Sed non elit placerat, porta elit vel, mollis orci.
    Aliquam ac dolor volutpat, dapibus libero vel, suscipit eros.
    Praesent egestas lacus at odio porttitor, finibus sodales neque aliquet.
    Nulla facilisis nulla rutrum viverra scelerisque.
    Sed eget nisi scelerisque, tincidunt tortor quis, tristique justo.
    Pellentesque et felis vestibulum, placerat diam sit amet, pulvinar ex.
    Nulla et odio non mi tincidunt dapibus nec at sapien.
    Quisque quis urna non purus porttitor sagittis lobortis quis risus.
    Aenean egestas enim eu placerat volutpat.
    Ut sed ante in mauris laoreet tincidunt.
    Quisque viverra ipsum interdum magna porta, vitae tempus ligula vehicula.
    Integer laoreet sem id erat lobortis fermentum.
    Quisque consectetur massa et dapibus convallis.
    Maecenas id nunc id velit posuere congue in vel risus.
    Proin quis est et risus interdum varius.
    Nunc a urna vel turpis aliquet interdum.
    Praesent elementum velit vel eleifend scelerisque.`,
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec est et libero dignissim aliquet in a nisi. Sed nunc lacus, consequat eget ante sed, interdum accumsan tellus. Nulla in augue velit. Duis erat massa, tincidunt nec aliquam facilisis, mattis vel arcu. Integer eu nisl eu eros fermentum fermentum nec sed arcu. Etiam rhoncus tempor rhoncus. Cras suscipit pellentesque ullamcorper.

    Integer dapibus tristique urna, nec semper libero pellentesque eu. Mauris finibus magna suscipit lacus elementum gravida. Morbi massa elit, mollis sed vehicula fermentum, convallis quis erat. Nam non magna bibendum, cursus urna ac, aliquet leo. Donec vulputate pretium malesuada. Quisque eget sollicitudin urna, non mollis sapien. Integer sagittis, nulla facilisis ultricies tempus, ante lorem dictum turpis, sed vestibulum enim purus at ligula. Fusce tempor, nibh non tincidunt dictum, leo enim posuere massa, id laoreet magna nunc pellentesque felis. Sed vitae interdum nulla. Aliquam dui libero, efficitur at mi sit amet.`,
    `
    I am small
    `,
]

export const generateCommands = () => (
    _.range(0, 1000).map(index => ({
        id: index,
        title: `some title ${index}`,
        input: `some input ${index}`,
        output: _.sample(possibleOutputs)
    }))
)