import { Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { manzana } from "../notoy/configDef";
import { cargar, del, guardar } from "../notoy/db";

export function main(tilin = Player) {
    const ui = new ActionFormData()
        .title('§6[§bManzana§6] §gManzana config')
        .body(`§f[${tilin.name}] §eAquí podrás configurar la manzana sus §befectos, §dduración, §6amplificador§r y §3item§r`)
        .button('§eConfigurar§r')
        .button('§6Resetear§r')
        .show(tilin).then(e => {
            if (e.canceled) return;
            else if (e.selection == 0) {
                configManzana(tilin);
            } else if (e.selection == 1) {
                resetear(tilin);
            }
        });
}

function configManzana(tilin) {
    const config = cargar('manzanaConfig') || manzana;
    const ui = new ModalFormData()
        .title("§aEn este menu podras configurar tu item como quieras. ahora pouedes poner un item totalmente personalizado o ya existente.\n\n §av.1.2-BETA :D. §dby §6[§bNotoy §dVP§6]§r")
        .dropdown('§sEFECTO§r', ['minecraft:absorption', 'minecraft:regeneration', 'minecraft:resistance', 'minecraft:fire_resistance'])
        .textField('§sDuración§r (ticks ej. 600 = 0:30)', '600', `${config.duracion || 600}`)
        .textField('§sAmplificador§r 0 = 1', '0', `${config.ampli || 0}`)
        .textField('§sID del Item§r (ej. minecraft:stick)', 'minecraft:enchanted_golden_apple', config.itemId || "minecraft:enchanted_golden_apple")
        .show(tilin).then(e => {
            if (e.canceled) return;

            const efectoSelec = ['absorcion', 'regeneracion', 'resistencia', 'resistenciaAlFuego'][e.formValues[0]];
            const duracion = Number(e.formValues[1]);
            const amplificador = Number(e.formValues[2]);
            const itemId = e.formValues[3];

            config.effectos[efectoSelec] = {
                duracion,
                amplificador,
                particulas: config.effectos[efectoSelec].particulas
            };
            config.itemId = itemId;

            guardar('manzanaConfig', config);
            tilin.sendMessage('§aConfiguración de §cmanzana §aguardada con éxito :D.');
        });
}

function resetear(tilin) {
    del("manzanaConfig");
    guardar('manzanaConfig', manzana);
    tilin.sendMessage('§aReseteado la configuración de la manzana con éxito :D.');
}
