import { exec, spawn } from "child_process"

export const rasaInit = async (dir: string): Promise<boolean> => {

    try {
        const rasa = spawn("python", ["-m", "rasa", "init", "--no-prompt"], { cwd: `${dir}`, env: { PYTHONIOENCODING: 'utf8' }, shell: true, detached: true })

        rasa.stdin.setDefaultEncoding("utf-8")

        rasa.stdout.setEncoding("utf-8")

        rasa.on('close', (code) => {
            if (code === 0) {
                console.log("Archivo creado exitosamente");
            } else {
                console.error(`El proceso de creación de archivo ha fallado con el código de salida: ${code}`);
            }
        });

        rasa.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });

        rasa.stderr.on('data', (data) => {
            console.error(`${data}`);
        });

        rasa.on("exit", (code) => {
            console.log(`El proceso hijo ha salido con el código: ${code}`);
        });
    } catch (err) {
        console.log(err)
    }


    return true;
}